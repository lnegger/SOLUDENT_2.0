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

  // Modal de reactivación
  showActivateModal = signal(false);
  laboratorioToActivate = signal<Laboratorio | null>(null);

  // Toasts y errores
  showSuccessToast = signal(false);
  successMessage = signal<string>('');
  showErrorModal = signal(false);
  errorModalMessage = signal<string>('');

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

  activarLaboratorio(lab: Laboratorio) {
    this.laboratorioToActivate.set(lab);
    this.showActivateModal.set(true);
  }

  confirmarActivar() {
    const lab = this.laboratorioToActivate();
    if (lab) {
      this.directorioService.reactivarLaboratorio(lab.CodigoLaboratorio).subscribe({
        next: () => {
          this.cargarLaboratorios();
          this.showActivateModal.set(false);
          this.laboratorioToActivate.set(null);
          this.successMessage.set(`El laboratorio ${lab.NombreLaboratorio} ha sido reactivado correctamente.`);
          this.showSuccessToast.set(true);
          setTimeout(() => this.showSuccessToast.set(false), 4000);
        },
        error: (err) => {
          console.error('Error reactivando laboratorio:', err);
          this.showActivateModal.set(false);
          this.laboratorioToActivate.set(null);
          this.errorModalMessage.set('No se pudo reactivar el laboratorio. Verifique la conexión con el servidor e intente nuevamente.');
          this.showErrorModal.set(true);
        }
      });
    }
  }

  cancelarActivar() {
    this.showActivateModal.set(false);
    this.laboratorioToActivate.set(null);
  }

  dismissSuccessToast() {
    this.showSuccessToast.set(false);
  }

  dismissErrorModal() {
    this.showErrorModal.set(false);
  }

  private normalizeActivo(lab: Laboratorio): string {
    const activo = lab.Activo ?? (lab as any).activo ?? '';
    return String(activo).trim().toUpperCase();
  }

  isActivo(lab: Laboratorio): boolean {
    const val = this.normalizeActivo(lab);
    return val === 'S' || val === '1';
  }
}

