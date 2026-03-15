'use server';

import { db } from '@/lib/db';
import { client, report } from '@/lib/db/schema';
import { hashNationalId } from '@/lib/crypto';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto'; // For randomUUID

// === Tipos Mínimos ===
export type SemaphoreStatus = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';

// === Función: Consultar Semáforo ===
export async function checkSemaphoreStatus(nationalId: string): Promise<{
    status: SemaphoreStatus;
    totalReports: number;
    message?: string;
}> {
    try {
        // 1. Hashear el ID para buscarlo de forma segura
        const hash = hashNationalId(nationalId);

        // 2. Buscar si el cliente existe
        const existingClient = await db.query.client.findFirst({
            where: eq(client.nationalIdHash, hash),
            with: {
                // Truco de Drizzle: No traemos todos los reportes, pero si necesitamos contarlos
                // Como aun no tenemos relaciones configuradas en schema.ts lo haremos manualmente abajo
            }
        });

        if (!existingClient) {
            return { status: 'UNKNOWN', totalReports: 0, message: 'Sin historial (Nuevo)' };
        }

        // 3. Obtener todos los reportes de este cliente
        const clientReports = await db.select()
            .from(report)
            .where(eq(report.clientId, existingClient.id))
            .orderBy(desc(report.createdAt));

        if (clientReports.length === 0) {
            return { status: 'UNKNOWN', totalReports: 0, message: 'Sin historial (Nuevo)' };
        }

        // 4. Lógica Básica del Semáforo
        // Si hay al menos un DANGER activo (no resuelto) -> ROJO
        const hasActiveDeuba = clientReports.some(r => r.status === 'DANGER' && !r.resolvedAt);
        if (hasActiveDeuba) return { status: 'RED', totalReports: clientReports.length, message: 'Alto Riesgo (Reportes activos)' };

        // Si tiene advertencias o deudas ya pagadas recientemente -> AMARILLO
        const hasWarning = clientReports.some(r => r.status === 'WARNING' || (r.status === 'DANGER' && r.resolvedAt));
        if (hasWarning) return { status: 'YELLOW', totalReports: clientReports.length, message: 'Precaución (Historial irregular)' };

        // Si solo tiene reportes positivos -> VERDE
        return { status: 'GREEN', totalReports: clientReports.length, message: 'Buen pagador (Confiable)' };

    } catch (error) {
        console.error('Error checking semaphore:', error);
        throw new Error('Error al consultar el semáforo');
    }
}

// === Función: Crear Reporte ===
export async function createReport(data: {
    nationalId: string;
    description: string;
    amount?: string;
    status: 'POSITIVE' | 'WARNING' | 'DANGER';
}) {
    // 1. Verificar Sesión del Comerciante
    const session = await auth.api.getSession({
        headers: await headers() // Requerido en Next.js Server Actions
    });

    if (!session || !session.user) {
        throw new Error('No autorizado');
    }

    try {
        const hash = hashNationalId(data.nationalId);
        let targetClientId = '';

        // 2. Buscar si el cliente ya existe
        const existingClient = await db.query.client.findFirst({
            where: eq(client.nationalIdHash, hash),
        });

        if (existingClient) {
            targetClientId = existingClient.id;
        } else {
            // 3. Crear el cliente si no existe
            const newClientId = crypto.randomUUID();
            await db.insert(client).values({
                id: newClientId,
                nationalIdHash: hash,
            });
            targetClientId = newClientId;
        }

        // 4. Insertar el Reporte usando el merchantId desde la sesión
        await db.insert(report).values({
            id: crypto.randomUUID(),
            clientId: targetClientId,
            merchantId: session.user.id,
            status: data.status,
            description: data.description,
            amount: data.amount,
        });

        return { success: true };
    } catch (error) {
        console.error('Error creating report:', error);
        throw new Error('Error al guardar el reporte');
    }
}
