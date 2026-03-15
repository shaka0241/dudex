import { createHmac } from 'crypto';

/**
 * Crea un hash unidireccional de un ID Nacional (Cédula, RUT, etc.)
 * utilizando HMAC-SHA256 con una clave secreta.
 * Esto asegura que la base de datos no contenga los IDs reales en texto plano,
 * protegiendo la privacidad de los usuarios si la DB es vulnerada.
 */
export function hashNationalId(nationalId: string): string {
  const secret = process.env.ID_HASH_SECRET;
  
  if (!secret) {
    throw new Error('ID_HASH_SECRET is not defined in environment variables');
  }

  // Estandarizamos el ID antes de hashear para evitar que "V-1234", "1234" o "v-1234 " generen hashes distintos
  const normalizedId = nationalId.toUpperCase().replace(/[^A-Z0-9]/g, '');

  return createHmac('sha256', secret)
    .update(normalizedId)
    .digest('hex');
}
