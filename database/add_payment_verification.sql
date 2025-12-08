-- =====================================================
-- SCRIPT: Payment Verification System
-- Descripción: Agrega funcionalidad de comprobante de pago
-- Fecha: 2025-12-07
-- =====================================================

-- PASO 1: Agregar columna comprobante_url a la tabla citas
-- Esta columna almacenará la URL pública del comprobante de pago
ALTER TABLE citas 
ADD COLUMN IF NOT EXISTS comprobante_url TEXT;

COMMENT ON COLUMN citas.comprobante_url IS 'URL pública del comprobante de pago/depósito subido por el paciente';

-- =====================================================
-- PASO 2: Crear Storage Bucket para Comprobantes
-- =====================================================

-- Crear bucket público llamado 'comprobantes'
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprobantes', 'comprobantes', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PASO 3: Políticas RLS para el bucket 'comprobantes'
-- =====================================================

-- Política 1: Permitir a usuarios públicos SUBIR archivos (INSERT)
-- Esto permite que los pacientes suban sus comprobantes
CREATE POLICY "Permitir subida pública de comprobantes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'comprobantes');

-- Política 2: Permitir a usuarios públicos VER archivos (SELECT)
-- Esto permite que los especialistas vean los comprobantes
CREATE POLICY "Permitir lectura pública de comprobantes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'comprobantes');

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'citas' AND column_name = 'comprobante_url';

-- Verificar que el bucket existe
SELECT id, name, public
FROM storage.buckets
WHERE id = 'comprobantes';

-- Verificar políticas RLS
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%comprobantes%';
