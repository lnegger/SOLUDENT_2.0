USE SOLUDENT_20;
GO

-- 1. Índice para búsquedas rápidas por empresa, fecha, hora y silla (claves únicas de una cita)
-- Esto acelerará drásticamente el "IF NOT EXISTS", los UPDATES y DELETES por clave.
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Citas_Busqueda' AND object_id = OBJECT_ID('Citas'))
BEGIN
    CREATE INDEX IX_Citas_Busqueda ON Citas (CodCia, FechaCita, HoraCita, Silla);
    PRINT 'Índice IX_Citas_Busqueda creado.';
END
ELSE
    PRINT 'El índice IX_Citas_Busqueda ya existe.';

-- 2. Índice para búsquedas por paciente
-- Esto acelerará la carga de citas en el contexto del paciente.
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Citas_Paciente' AND object_id = OBJECT_ID('Citas'))
BEGIN
    CREATE INDEX IX_Citas_Paciente ON Citas (CodCia, CedulaPaciente, Representado);
    PRINT 'Índice IX_Citas_Paciente creado.';
END
ELSE
    PRINT 'El índice IX_Citas_Paciente ya existe.';

-- 3. Índice solo por fecha para el filtrado del calendario global
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Citas_Fecha' AND object_id = OBJECT_ID('Citas'))
BEGIN
    CREATE INDEX IX_Citas_Fecha ON Citas (CodCia, FechaCita);
    PRINT 'Índice IX_Citas_Fecha creado.';
END
ELSE
    PRINT 'El índice IX_Citas_Fecha ya existe.';
GO
