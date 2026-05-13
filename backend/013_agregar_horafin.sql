-- =====================================================
-- 013: Agregar campo HoraFin a la tabla Citas
-- Permite citas de duración variable (ej: 10:00 a 12:00)
-- Ejecutar en SQL Server Management Studio
-- =====================================================

-- 1. Agregar columna HoraFin a la tabla Citas
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Citas' AND COLUMN_NAME = 'HoraFin')
BEGIN
    ALTER TABLE Citas ADD HoraFin VARCHAR(13) NULL;
    PRINT 'Columna HoraFin agregada exitosamente.';
END
ELSE
    PRINT 'La columna HoraFin ya existe.';
GO

-- 2. Actualizar registros existentes: HoraFin = HoraCita + 30 minutos (valor por defecto)
UPDATE Citas 
SET HoraFin = CONVERT(VARCHAR(8), DATEADD(MINUTE, 30, CAST(HoraCita AS TIME)), 108)
WHERE HoraFin IS NULL;
GO

-- 3. Actualizar la Vista VW_CitasPorPaciente para incluir HoraFin
ALTER VIEW VW_CitasPorPaciente AS
SELECT 
    c.CodCia, c.CedulaPaciente, c.Representado, c.FechaCita, 
    c.HoraCita, c.HoraFin, c.HoraReal, c.Turno, c.StatusCita, 
    c.Confirmada, c.Silla, c.Motivo,
    p.Nombre,
    CASE c.StatusCita 
        WHEN 'P' THEN 'Pendiente' 
        WHEN 'C' THEN 'Cumplida' 
        ELSE 'Desconocido' 
    END AS Status,
    CASE c.Confirmada 
        WHEN 1 THEN 'Sí' 
        WHEN 0 THEN 'No' 
    END AS EstaConfirmada
FROM Citas c
INNER JOIN Pacientes p ON c.CodCia = p.CodCia 
    AND c.CedulaPaciente = p.Cedula 
    AND c.Representado = p.Representado;
GO

-- 4. Actualizar el SP para incluir HoraFin
ALTER PROCEDURE dbo.SP_Edicion_Citas_Agenda
@Accion    VARCHAR(3),
@CodCia varchar(2),
@CedulaPaciente varchar(12),
@Representado varchar(2),
@FechaCita DATETIME,
@HoraCita varchar(13),
@Confirmada BIT,
@Silla INT,
@Motivo VARCHAR(250) = NULL,
@HoraFin VARCHAR(13) = NULL
AS

If @Accion = 'INC'
    BEGIN
        IF NOT EXISTS(SELECT CedulaPaciente FROM Citas WHERE 
                    CodCia = @CodCia 
                    AND FechaCita = @FechaCita 
                    AND HoraCita = @HoraCita
                    AND Silla = @Silla)
            INSERT INTO Citas 
                (CodCia, CedulaPaciente, Representado, FechaCita, HoraCita,
                 Confirmada, Silla, Motivo, HoraFin)
                VALUES(@CodCia, @CedulaPaciente, @Representado, @FechaCita, 
                    @HoraCita, @Confirmada, @Silla, @Motivo, @HoraFin)
    END
    
    IF @Accion = 'MOD'
        UPDATE Citas SET Motivo = @Motivo, Confirmada = @Confirmada, HoraFin = @HoraFin
        WHERE CodCia = @CodCia 
            AND FechaCita = @FechaCita 
            AND HoraCita = @HoraCita
            AND Silla = @Silla

    IF @Accion = 'ELI'
        DELETE Citas WHERE 
            CodCia = @CodCia 
            AND FechaCita = @FechaCita 
            AND HoraCita = @HoraCita
            AND Silla = @Silla

    IF @Accion = 'ELV'
        DELETE Citas WHERE 
            CodCia = @CodCia 
            AND CedulaPaciente = @CedulaPaciente
            AND Representado = @Representado
            AND FechaCita = @FechaCita 
            AND Silla = @Silla

    IF @Accion = 'CON'
        UPDATE Citas SET Confirmada = 
        case confirmada 
            when 0 then 1
            when 1 then 0
        end
        WHERE 
            CodCia = @CodCia 
            AND CedulaPaciente = @CedulaPaciente
            AND Representado = @Representado
            AND FechaCita = @FechaCita 
            AND Silla = @Silla

    IF @Accion = 'STA'
        IF @HoraCita = '999'
            UPDATE Citas SET StatusCita = 
            case StatusCita 
                when 'P' then 'C'
                when 'C' then 'P'
            end
            WHERE 
                CodCia = @CodCia 
                AND CedulaPaciente = @CedulaPaciente
                AND Representado = @Representado
                AND FechaCita = @FechaCita 
                AND Silla = @Silla
        ELSE
            UPDATE Citas SET StatusCita = 
            case StatusCita 
                when 'P' then 'C'
                when 'C' then 'P'
            end
            WHERE 
                CodCia = @CodCia 
                AND FechaCita = @FechaCita 
                AND HoraCita = @HoraCita
                AND Silla = @Silla
GO
