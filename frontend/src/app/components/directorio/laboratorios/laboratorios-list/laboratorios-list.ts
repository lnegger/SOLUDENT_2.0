import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DirectorioService, Laboratorio } from '../../../../core/services/directorio';

@Component({
  selector: 'app-laboratorios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './laboratorios-list.html',
  styleUrl: './laboratorios-list.scss'
})
export class LaboratoriosList implements OnInit {
  private directorioService = inject(DirectorioService);
  
  laboratorios = signal<Laboratorio[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Modal de confirmación
  showModal = signal(false);
  laboratorioToDelete = signal<Laboratorio | null>(null);

  ngOnInit() {
    this.cargarLaboratorios();
  }

  cargarLaboratorios() {
    this.isLoading.set(true);
    this.directorioService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error cargando laboratorios');
        this.isLoading.set(false);
      }
    });
  }

  eliminar(lab: Laboratorio) {
    this.laboratorioToDelete.set(lab);
    this.showModal.set(true);
  }

  confirmarEliminar() {
    const lab = this.laboratorioToDelete();
    if (lab) {
      this.directorioService.deleteLaboratorio(lab.CodigoLaboratorio).subscribe({
        next: () => {
          this.cargarLaboratorios();
          this.showModal.set(false);
          this.laboratorioToDelete.set(null);
        },
        error: () => {
          this.showModal.set(false);
          this.laboratorioToDelete.set(null);
          alert('Error eliminando laboratorio');
        }
      });
    }
  }

  cancelarEliminar() {
    this.showModal.set(false);
    this.laboratorioToDelete.set(null);
  }
}

