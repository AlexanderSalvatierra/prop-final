-- Create the enum type for appointment types
CREATE TYPE tipo_cita_enum AS ENUM ('Primera Vez', 'Subsecuente', 'Tamiz', 'Revision');

-- Add 'tipo' column to 'citas' table using the enum, default to 'Primera Vez'
ALTER TABLE citas 
ADD COLUMN tipo tipo_cita_enum DEFAULT 'Primera Vez';

-- Add 'hora' column to 'citas' table of type time
ALTER TABLE citas 
ADD COLUMN hora time;
