-- Add 'No Asistió' to the enum type
ALTER TYPE estado_cita_enum ADD VALUE IF NOT EXISTS 'No Asistió';
