-- Instrucciones: Ejecuta este script en el SQL Editor de tu panel de Supabase
-- para habilitar la Seguridad a Nivel de Fila (RLS) en las nuevas tablas.

-- 1. Habilitar RLS en las tablas
ALTER TABLE "client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "report" ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para 'client'
-- Queremos que cualquier usuario pueda leer (SELECT) la tabla client para consultar el historial
-- y también permitir que el servidor inserte (INSERT) nuevos clientes.
-- Dado que controlamos todo vía el Backend (Server Actions) con el "Service Role" o clave Anon,
-- estas políticas garantizan que no haya fallos al llamar a db.select() desde Drizzle.

CREATE POLICY "Public Select on Client" 
ON "client" 
FOR SELECT 
USING (true);

CREATE POLICY "Public Insert on Client" 
ON "client" 
FOR INSERT 
WITH CHECK (true);

-- 3. Políticas para 'report'
-- Queremos leer (SELECT) cualquier reporte
CREATE POLICY "Public Select on Report" 
ON "report" 
FOR SELECT 
USING (true);

-- Aquí está la regla de seguridad más vital:
-- Nadie puede Update/Delete un reporte al menos que el comerciante (merchantId) coincida con su sesión
-- Nota: En la configuración por defecto de Drizzle + Next.js Server actions como usamos aquí, 
-- Drizzle se conecta pasando por alto RLS si usas el Service Role key u omites pasar el JWT.
-- Para un MVP Server-side, esto previene ataques directos a la BD. 
-- Si migras a un cliente Supabase (supabase-js en el navegador), estas políticas aplicarán estrictamente
-- obligando a que auth.uid() coincida con merchantId.

CREATE POLICY "Delete own reports only" 
ON "report" 
FOR DELETE 
USING (auth.uid()::text = "merchantId");

CREATE POLICY "Update own reports only" 
ON "report" 
FOR UPDATE 
USING (auth.uid()::text = "merchantId");
