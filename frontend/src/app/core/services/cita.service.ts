import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cita {
  CodCia: string;
  FechaCita: string; // YYYY-MM-DD
  HoraCita: string;
  HoraFin?: string;
  HoraReal?: string;
  Turno?: string;
  CedulaPaciente: string;
  Representado: string;
  NombrePaciente?: string;
  StatusCita?: string;
  StatusDesc?: string;
  Confirmada: boolean;
  EstaConfirmadaDesc?: string;
  Silla: number;
  Motivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  public apiBaseUrl = 'http://127.0.0.1:8000';
  private apiUrl = `${this.apiBaseUrl}/api/citas`;

  constructor(private http: HttpClient) { }

  getTodasLasCitas(fechaInicio?: string, fechaFin?: string): Observable<Cita[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fecha_inicio', fechaInicio);
    if (fechaFin) params = params.set('fecha_fin', fechaFin);
    return this.http.get<Cita[]>(`${this.apiUrl}/`, { params });
  }

  getCitasPaciente(cedula: string, representado: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/${cedula}/${representado}`);
  }

  createCita(cita: Cita): Observable<any> {
    return this.http.post(this.apiUrl, cita);
  }

  updateCita(cita: Cita): Observable<any> {
    return this.http.put(`${this.apiUrl}/modificar`, cita);
  }

  deleteCita(fecha: string, hora: string, silla: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fecha}/${hora}/${silla}`);
  }

  toggleStatus(fecha: string, hora: string, silla: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/estado/${fecha}/${hora}/${silla}`, {});
  }
}
