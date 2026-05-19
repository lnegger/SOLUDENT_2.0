import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DirectorioService, Proveedor } from '../../../../core/services/directorio';

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proveedores-list.html',
  styleUrl: './proveedores-list.scss'
})
export class ProveedoresList implements OnInit {
  private directorioService = inject(DirectorioService);
  
  proveedores = signal<Proveedor[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Modal de eliminación
  showModal = signal(false);
  proveedorToDelete = signal<Proveedor | null>(null);

  // Modal de reactivación
  showActivateModal = signal(false);
  proveedorToActivate = signal<Proveedor | null>(null);

  // Toasts y errores
  showSuccessToast = signal(false);
  successMessage = signal<string>('');
  showErrorModal = signal(false);
  errorModalMessage = signal<string>('');

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.isLoading.set(true);
    this.directorioService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error cargando proveedores');
        this.isLoading.set(false);
      }
    });
  }

  eliminar(prov: Proveedor) {
    this.proveedorToDelete.set(prov);
    this.showModal.set(true);
  }

  confirmarEliminar() {
    const prov = this.proveedorToDelete();
    if (prov) {
      this.directorioService.deleteProveedor(prov.CodigoProveedor).subscribe({
        next: () => {
          this.cargarProveedores();
          this.showModal.set(false);
          this.proveedorToDelete.set(null);
        },
        error: () => {
          this.showModal.set(false);
          this.proveedorToDelete.set(null);
          alert('Error eliminando proveedor');
        }
      });
    }
  }

  cancelarEliminar() {
    this.showModal.set(false);
    this.proveedorToDelete.set(null);
  }

  activarProveedor(prov: Proveedor) {
    this.proveedorToActivate.set(prov);
    this.showActivateModal.set(true);
  }

  confirmarActivar() {
    const prov = this.proveedorToActivate();
    if (prov) {
      this.directorioService.reactivarProveedor(prov.CodigoProveedor).subscribe({
        next: () => {
          this.cargarProveedores();
          this.showActivateModal.set(false);
          this.proveedorToActivate.set(null);
          this.successMessage.set(`El proveedor ${prov.NombreProveedor} ha sido reactivado correctamente.`);
          this.showSuccessToast.set(true);
          setTimeout(() => this.showSuccessToast.set(false), 4000);
        },
        error: (err) => {
          console.error('Error reactivando proveedor:', err);
          this.showActivateModal.set(false);
          this.proveedorToActivate.set(null);
          this.errorModalMessage.set('No se pudo reactivar el proveedor. Verifique la conexión con el servidor e intente nuevamente.');
          this.showErrorModal.set(true);
        }
      });
    }
  }

  cancelarActivar() {
    this.showActivateModal.set(false);
    this.proveedorToActivate.set(null);
  }

  dismissSuccessToast() {
    this.showSuccessToast.set(false);
  }

  dismissErrorModal() {
    this.showErrorModal.set(false);
  }

  private normalizeActivo(prov: Proveedor): string {
    const activo = prov.Activo ?? prov.activo ?? '';
    return String(activo).trim().toUpperCase();
  }

  isActivo(prov: Proveedor): boolean {
    const val = this.normalizeActivo(prov);
    return val === 'S' || val === '1';
  }
}
