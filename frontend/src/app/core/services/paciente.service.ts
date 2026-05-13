import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  public apiBaseUrl = 'http://127.0.0.1:8000';
  private apiUrl = `${this.apiBaseUrl}/api/pacientes`;

  uploadFoto(file: File): Observable<{path: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{path: string}>(`${this.apiBaseUrl}/api/upload/foto`, formData);
  }

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  getPaciente(cedula: string, representado: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${cedula}/${representado}`);
  }

  createPaciente(paciente: Partial<Paciente>): Observable<any> {
    return this.http.post(this.apiUrl, paciente);
  }

  updatePaciente(cedula: string, representado: string, paciente: Partial<Paciente>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cedula}/${representado}`, paciente);
  }

  reactivarPaciente(cedula: string, representado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cedula}/${representado}/reactivar`, {});
  }

  deletePaciente(cedula: string, representado: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cedula}/${representado}`);
  }
}
