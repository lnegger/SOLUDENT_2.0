import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Colega {
  CodigoColega: string;
  NombreColega: string;
  DireccionHabitacion?: string;
  DireccionOficina?: string;
  TelefonoHabitacion1?: string;
  TelefonoHabitacion2?: string;
  TelefonoOficina1?: string;
  TelefonoOficina2?: string;
  Fax?: string;
  CorreoElectronico?: string;
  TelefonoCelular?: string;
  Especialidad?: string;
  Observacion?: string;
}

export interface Laboratorio {
  CodigoLaboratorio: string;
  NombreLaboratorio: string;
  Contacto?: string;
  DireccionOficina?: string;
  TelefonoOficina1?: string;
  TelefonoOficina2?: string;
  Fax?: string;
  CorreoElectronico?: string;
  TelefonoCelular?: string;
  Especialidad?: string;
  Observacion?: string;
}

export interface Proveedor {
  CodigoProveedor: string;
  NombreProveedor: string;
  Contacto?: string;
  DireccionOficina?: string;
  TelefonoOficina1?: string;
  TelefonoOficina2?: string;
  Fax?: string;
  CorreoElectronico?: string;
  TelefonoCelular?: string;
  Especialidad?: string;
  Observacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DirectorioService {
  private apiBaseUrl = 'http://127.0.0.1:8000';
  private apiUrl = `${this.apiBaseUrl}/directorio`;

  constructor(private http: HttpClient) { }

  // Colegas
  getColegas(): Observable<Colega[]> {
    return this.http.get<Colega[]>(`${this.apiUrl}/colegas`);
  }
  createColega(colega: Colega): Observable<any> {
    return this.http.post(`${this.apiUrl}/colegas`, colega);
  }
  updateColega(codigo: string, colega: Colega): Observable<any> {
    return this.http.put(`${this.apiUrl}/colegas/${codigo}`, colega);
  }
  deleteColega(codigo: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/colegas/${codigo}`);
  }

  // Laboratorios
  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.apiUrl}/laboratorios`);
  }
  createLaboratorio(lab: Laboratorio): Observable<any> {
    return this.http.post(`${this.apiUrl}/laboratorios`, lab);
  }
  updateLaboratorio(codigo: string, lab: Laboratorio): Observable<any> {
    return this.http.put(`${this.apiUrl}/laboratorios/${codigo}`, lab);
  }
  deleteLaboratorio(codigo: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/laboratorios/${codigo}`);
  }

  // Proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/proveedores`);
  }
  createProveedor(prov: Proveedor): Observable<any> {
    return this.http.post(`${this.apiUrl}/proveedores`, prov);
  }
  updateProveedor(codigo: string, prov: Proveedor): Observable<any> {
    return this.http.put(`${this.apiUrl}/proveedores/${codigo}`, prov);
  }
  deleteProveedor(codigo: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proveedores/${codigo}`);
  }
}

