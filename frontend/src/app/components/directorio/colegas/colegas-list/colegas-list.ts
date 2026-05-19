import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DirectorioService, Colega } from '../../../../core/services/directorio';

@Component({
  selector: 'app-colegas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './colegas-list.html',
  styleUrl: './colegas-list.scss'
})
export class ColegasList implements OnInit {
  private directorioService = inject(DirectorioService);
  
  colegas = signal<Colega[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit() {
    this.cargarColegas();
  }

  cargarColegas() {
    this.isLoading.set(true);
    this.directorioService.getColegas().subscribe({
      next: (data) => {
        this.colegas.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error cargando colegas');
        this.isLoading.set(false);
      }
    });
  }

  eliminar(colega: Colega) {
    if (confirm(`¿Está seguro de eliminar a ${colega.NombreColega}?`)) {
      this.directorioService.deleteColega(colega.CodigoColega).subscribe({
        next: () => this.cargarColegas(),
        error: () => alert('Error eliminando colega')
      });
    }
  }
}

