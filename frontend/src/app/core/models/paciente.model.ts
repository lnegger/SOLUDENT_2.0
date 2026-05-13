export interface Paciente {
  CodCia: string;
  Cedula: string;
  Representado?: string;
  CamposClave?: string;
  Nombre: string;
  NombreRepresentante?: string;
  ArchivoFoto?: string;
  FechaNacimiento?: string; // Date comes as ISO string
  NivelEducativo?: number;
  Sexo?: number;
  GrupoSanguineo?: number;
  FactorRH?: number;
  Activo?: number;
  EstadoCivil?: number;
  Trato?: string;
  DireccionHabitacion?: string;
  DireccionOficina?: string;
  TelefHabita1?: string;
  TelefHabita2?: string;
  TelefOficina1?: string;
  TelefOficina2?: string;
  TelefCelular?: string;
  CorreoElectronico?: string;
  Recomendado?: string;
  HistoriaClinica?: string;
  Ocupacion?: string;
  TipoPaciente?: number;
  ObservacionPresupuesto?: string;
  FechaIngreso?: string;
  CuentaTotal?: number;
  Abonos?: number;
  Saldo?: number;
  es_dependiente?: boolean;
}
