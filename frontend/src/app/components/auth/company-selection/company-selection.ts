import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface Empresa {
  CodigoEmpresa: string;
  NombreEmpresa?: string;
  Nombre?: string;
}

@Component({
  selector: 'app-company-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-selection.html',
  styleUrls: ['./company-selection.scss']
})
export class CompanySelection implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  empresas = signal<Empresa[]>([]);
  selectedCompany = signal<string | null>(localStorage.getItem('selectedCompany'));
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.loadEmpresas();
  }

  loadEmpresas() {
    this.http.get<Empresa[]>('http://127.0.0.1:8000/api/empresas').subscribe({
      next: (data) => {
        this.empresas.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando empresas', err);
        this.errorMessage.set('No se pudieron cargar las empresas.');
        this.isLoading.set(false);
      }
    });
  }

  selectCompany(codCia: string) {
    this.selectedCompany.set(codCia);
  }

  continue() {
    const selected = this.selectedCompany();
    if (!selected) {
      this.errorMessage.set('Selecciona una empresa antes de continuar.');
      return;
    }

    localStorage.setItem('selectedCompany', selected);
    this.router.navigate(['/login']);
  }
}
