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

  // Modal de confirmación
  showModal = signal(false);
  colegaToDelete = signal<Colega | null>(null);

  // Modal de reactivación
  showActivateModal = signal(false);
  colegaToActivate = signal<Colega | null>(null);

  // Toasts y errores
  showSuccessToast = signal(false);
  successMessage = signal<string>('');
  showErrorModal = signal(false);
  errorModalMessage = signal<string>('');

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
    this.colegaToDelete.set(colega);
    this.showModal.set(true);
  }

  confirmarEliminar() {
    const colega = this.colegaToDelete();
    if (colega) {
      this.directorioService.deleteColega(colega.CodigoColega).subscribe({
        next: () => {
          this.cargarColegas();
          this.showModal.set(false);
          this.colegaToDelete.set(null);
        },
        error: () => {
          this.showModal.set(false);
          this.colegaToDelete.set(null);
          // mantener comportamiento sencillo: mostrar alerta
          alert('Error eliminando colega');
        }
      });
    }
  }

  cancelarEliminar() {
    this.showModal.set(false);
    this.colegaToDelete.set(null);
  }

  activarColega(colega: Colega) {
    this.colegaToActivate.set(colega);
    this.showActivateModal.set(true);
  }

  confirmarActivar() {
    const colega = this.colegaToActivate();
    if (colega) {
      this.directorioService.reactivarColega(colega.CodigoColega).subscribe({
        next: () => {
          this.cargarColegas();
          this.showActivateModal.set(false);
          this.colegaToActivate.set(null);
          this.successMessage.set(`El colega ${colega.NombreColega} ha sido reactivado correctamente.`);
          this.showSuccessToast.set(true);
          setTimeout(() => this.showSuccessToast.set(false), 4000);
        },
        error: (err) => {
          console.error('Error reactivando colega:', err);
          this.showActivateModal.set(false);
          this.colegaToActivate.set(null);
          this.errorModalMessage.set('No se pudo reactivar el colega. Verifique la conexión con el servidor e intente nuevamente.');
          this.showErrorModal.set(true);
        }
      });
    }
  }

  cancelarActivar() {
    this.showActivateModal.set(false);
    this.colegaToActivate.set(null);
  }

  dismissSuccessToast() {
    this.showSuccessToast.set(false);
  }

  dismissErrorModal() {
    this.showErrorModal.set(false);
  }

  private normalizeActivo(colega: Colega): string {
    const activo = colega.Activo ?? (colega as any).activo ?? '';
    return String(activo).trim().toUpperCase();
  }

  isActivo(colega: Colega): boolean {
    const val = this.normalizeActivo(colega);
    return val === 'S' || val === '1';
  }
}

