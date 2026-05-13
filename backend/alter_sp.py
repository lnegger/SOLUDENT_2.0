import urllib.parse
from sqlalchemy import create_engine, text

DRIVER = 'ODBC Driver 17 for SQL Server'
SERVER = r'localhost\SQLEXPRESS2022'
DATABASE = 'SOLUDENT_20'
USERNAME = 'sa'
PASSWORD = 'clasified'

params = urllib.parse.quote_plus(f'DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD};TrustServerCertificate=yes')
engine = create_engine(f'mssql+pyodbc:///?odbc_connect={params}')

sql_command = """
ALTER PROCEDURE [dbo].[SP_Edicion_Pacientes]
@Accion					VARCHAR(3) ,			                    
@CodCia					VARCHAR(2) ,								
@Cedula					VARCHAR(12) = '',							
@Representado			VARCHAR(2) = '',						
@Nombre					VARCHAR(50) = '',							
@NombreRepresentante	VARCHAR(50) = '',					
@FechaNacimiento		DATETIME  = '19990101',							
@NivelEducativo			TINYINT = 0,							
@ArchivoFoto			VARCHAR(150) = '',						
@Sexo					TINYINT = 0,								
@GrupoSanguineo			TINYINT = 0,							
@FactorRH				TINYINT = 0,								
@Activo					BIT = 0,									
@Alerta					BIT = 0,									
@EstadoCivil			TINYINT = 0,							
@Trato					VARCHAR(5) = '',							
@DireccionHaBITacion	VARCHAR(100) = '',					
@DireccionOficina		VARCHAR(100) = '',						
@TelefHaBITa1			VARCHAR(15) = '',						
@TelefHaBITa2			VARCHAR(15) = '',						
@TelefOficina1			VARCHAR(15) = '',						
@TelefOficina2			VARCHAR(15) = '',						
@CorreoElectronico		VARCHAR(30) = '',						
@Recomendado			VARCHAR(50) = '',						
@CuentaTotal			numeric(18,2) =0,							
@Abonos					numeric(18,2) =0,							
@Saldo					numeric(18,2) =0,							
@HistoriaClinica		TEXT = '',								
@Ocupacion				VARCHAR(50) = '',							
@PorcentajeDescuento	NUMERIC(6,2) = '',					
@TipoPaciente			TINYINT = 0,							
@TelefCelular			VARCHAR(15) = '',						
@UbicacionOtrasFotos	VARCHAR(150) = '',							
@ObservacionPresupuesto	VARCHAR(200) = ''	
AS
DECLARE @REGISTROS INT = 0
If @Accion = 'INC' OR @Accion = 'MOD'
	BEGIN
		IF NOT EXISTS(SELECT Cedula FROM Pacientes WHERE CodCia = @CodCia AND
					Cedula = @Cedula AND Representado = @Representado)

			INSERT INTO Pacientes (CodCia, Cedula, Representado, CamposClave)
				VALUES(@CodCia, @Cedula, @Representado, (@CodCia + @Cedula + @Representado))

		UPDATE Pacientes 
		SET	
			Nombre				= @Nombre,
			NombreRepresentante	= @NombreRepresentante,
			FechaNacimiento		= @FechaNacimiento,
			NivelEducativo		= @NivelEducativo,
			ArchivoFoto			= @ArchivoFoto,
			Sexo				= @Sexo,
			GrupoSanguineo		= @GrupoSanguineo,
			FactorRH			= @FactorRH,
			Activo				= @Activo,
			Alerta				= @Alerta,
			EstadoCivil			= @EstadoCivil,
			Trato				= @Trato,
			DireccionHaBITacion	= @DireccionHaBITacion,
			DireccionOficina	= @DireccionOficina,
			TelefHaBITa1		= @TelefHaBITa1,
			TelefHaBITa2		= @TelefHaBITa2,
			TelefOficina1		= @TelefOficina1,
			TelefOficina2		= @TelefOficina2,
			CorreoElectronico	= @CorreoElectronico,
			FechaIngreso		= GETDATE(),
			Recomendado			= @Recomendado,
			HistoriaClinica		= @HistoriaClinica,
			Ocupacion			= @Ocupacion,
			PorcentajeDescuento	= @PorcentajeDescuento,
			TipoPaciente		= @TipoPaciente,
			TelefCelular		= @TelefCelular,
			ObservacionPresupuesto  = @ObservacionPresupuesto,
			UbicacionOtrasFotos	= @UbicacionOtrasFotos
		WHERE CodCia = @CodCia AND
			Cedula = @Cedula AND Representado = @Representado
			SET @REGISTROS = @REGISTROS + @@ROWCOUNT

	END
	IF @Accion = 'ELI'
		BEGIN
			-- BORRADO LÓGICO
			UPDATE Pacientes
			SET Activo = 0
			WHERE CodCia = @CodCia AND
				Cedula = @Cedula AND
				Representado = @Representado
			SET @REGISTROS = @REGISTROS + @@ROWCOUNT
		END

	IF @Accion IN ('COU','COT','COB')
		IF @Accion = 'COB'
			SELECT  CamposClave,
					Cedula,
					Representado,
					Nombre, 
					TelefHabita1, 
					TelefOficina1, 
					TelefCelular, 
					Saldo,
					Activo
			FROM Pacientes 
			WHERE	CodCia = @CodCia AND
					Cedula like '%' AND
					Activo = 1 -- Solo listar activos
			ORDER BY Cedula,Representado		
		ELSE
			IF @Accion = 'COU'
				SELECT  CamposClave,
						Cedula,
						Representado,
						Nombre, 
						NombreRepresentante, 
						FechaNacimiento, 
						NivelEducativo, 
						ArchivoFoto, 
						Sexo, 
						GrupoSanguineo, 
						FactorRH, 
						Activo, 
						Alerta, 
						CASE WHEN EstadoCivil IS NULL THEN 0 ELSE EstadoCivil END EstadoCivil, 
						Trato, 
						DireccionHaBITacion, 
						DireccionOficina, 
						TelefHaBITa1, 
						TelefHaBITa2, 
						TelefOficina1, 
						TelefOficina2, 
						CorreoElectronico, 
						FechaIngreso, 
						Recomendado, 
						HistoriaClinica, 
						Ocupacion, 
						PorcentajeDescuento, 
						TipoPaciente, 
						TelefCelular, 
						ObservacionPresupuesto,
						UltimaCita, 
						ProximaCita, 
						UbicacionOtrasFotos,
						Saldo,
						Abonos,
						CuentaTotal
				FROM Pacientes 
				WHERE	CodCia = @CodCia AND
						Cedula = @Cedula AND
						Representado = @Representado 
			ELSE
				SELECT  CamposClave,
						Cedula,
						Representado,
						Nombre, 
						NombreRepresentante, 
						FechaNacimiento, 
						NivelEducativo, 
						ArchivoFoto, 
						Sexo, 
						GrupoSanguineo, 
						FactorRH, 
						Activo, 
						Alerta, 
						CASE WHEN EstadoCivil IS NULL THEN 0 ELSE EstadoCivil END EstadoCivil, 
						Trato, 
						DireccionHaBITacion, 
						DireccionOficina, 
						TelefHaBITa1, 
						TelefHaBITa2, 
						TelefOficina1, 
						TelefOficina2, 
						CorreoElectronico, 
						FechaIngreso, 
						Recomendado, 
						HistoriaClinica, 
						Ocupacion, 
						PorcentajeDescuento, 
						TipoPaciente, 
						TelefCelular, 
						ObservacionPresupuesto,
						UltimaCita, 
						ProximaCita, 
						UbicacionOtrasFotos,
						Saldo,
						Abonos,
						CuentaTotal
				FROM	Pacientes 
				WHERE	CodCia = @CodCia AND 
						Cedula LIKE '%' 
				ORDER BY Cedula,Representado
						
		IF	@REGISTROS > 0
			BEGIN
				IF @Accion = 'INC'
					SELECT 'INCLUIDO' AS RESULTADO
				IF @Accion = 'MOD'
					SELECT 'MODIFICADO' AS RESULTADO
				IF @Accion = 'ELI'
					SELECT 'ELIMINADO' AS RESULTADO
			END
"""

with engine.begin() as conn:
    conn.execute(text(sql_command))
    print("SP_Edicion_Pacientes successfully altered.")
