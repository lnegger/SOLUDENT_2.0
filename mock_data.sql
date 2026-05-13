USE SOLUDENT_20;
GO

-- Limpiar tablas principales para evitar duplicados en pruebas
DELETE FROM Pacientes;
DELETE FROM Usuarios;
DELETE FROM Laboratorios;
DELETE FROM Farmacos;
DELETE FROM Empresa;

-- 1. Insertar Empresa Principal
INSERT INTO Empresa (
    CodigoEmpresa, NombreEmpresa, Nombre, NumeroAbono, FechaActual, NumeroRecipe, 
    Direccion, Telefono1, Correo, NombreContacto, NombreDoc, NroSillas, SimboloMoneda
) VALUES (
    '01', 'SoluDent 2.0 Clinic', 'SoluDent', 1, GETDATE(), 1,
    'Av. Principal 123', '555-1234', 'contacto@sanctuary.com', 'Admin', 'Dr. Smith', 3, '$'
);

-- 2. Insertar Usuario Administrador
-- Nota: La contraseña está en texto plano temporalmente, el backend en Python la encriptará con Bcrypt.
INSERT INTO Usuarios (
    CodCia, CodigoUsuario, NombreUsuario, ClaveAcceso, CamposClave
) VALUES (
    '01', 'ADMIN', 'Administrador Principal', 'admin123', '01ADMIN'
);

-- 3. Insertar Paciente de Prueba (Ej: Eleanor Vance del diseño de Stitch)
INSERT INTO Pacientes (
    CodCia, Cedula, Representado, CamposClave, Nombre, FechaNacimiento, Sexo, 
    Activo, DireccionHabitacion, TelefCelular, CorreoElectronico, FechaIngreso,
    CuentaTotal, Abonos, Saldo, TipoPaciente
) VALUES (
    '01', 'V12345678', '0', '01V123456780', 'Eleanor Vance', '1990-05-15', 1,
    1, 'Calle Los Rosales', '555-9876', 'eleanor@example.com', GETDATE(),
    0, 0, 0, 1
);

-- 4. Insertar Laboratorio de Prueba
INSERT INTO Laboratorios (
    CodCia, CodigoLaboratorio, NombreLaboratorio, Contacto, TelefonoOficina1, CamposClave
) VALUES (
    '01', 'LAB01', 'Laboratorio Dental Central', 'Juan Perez', '555-4444', '01LAB01'
);

-- 5. Insertar Fármacos de Prueba
INSERT INTO Farmacos (CodCia, CodigoFarmaco, NombreFarmaco, CamposClave) VALUES ('01', 'F01', 'Amoxicilina 500mg', '01F01');
INSERT INTO Farmacos (CodCia, CodigoFarmaco, NombreFarmaco, CamposClave) VALUES ('01', 'F02', 'Ibuprofeno 400mg', '01F02');
