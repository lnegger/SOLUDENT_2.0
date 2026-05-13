import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../core/services/paciente.service';
import { Paciente } from '../../core/models/paciente.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pacientes-list.html',
  styleUrls: ['./pacientes-list.scss']
})
export class PacientesList implements OnInit {
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  public apiBaseUrl = this.pacienteService.apiBaseUrl;

  pacientes = signal<Paciente[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  searchTerm = signal('');
  
  // Modal de confirmación
  showModal = signal(false);
  pacienteToDelete = signal<Paciente | null>(null);
  
  // Modal de reactivación
  showActivateModal = signal(false);
  pacienteToActivate = signal<Paciente | null>(null);
  
  // Toast de éxito
  showSuccessToast = signal(false);
  successMessage = signal('');
  
  // Modal de error
  showErrorModal = signal(false);
  errorModalMessage = signal('');

  // Paginación
  currentPage = signal(1);
  pageSize = signal(10);

  filteredPacientes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.pacientes();
    
    return this.pacientes().filter(p => 
      p.Nombre.toLowerCase().includes(term) || 
      p.Cedula.toLowerCase().includes(term)
    );
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredPacientes().length / this.pageSize()));
  });

  paginatedPacientes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredPacientes().slice(start, start + this.pageSize());
  });

  ngOnInit() {
    this.cargarPacientes();
  }

  cargarPacientes() {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar pacientes', err);
        this.errorMessage.set('No se pudieron cargar los pacientes.');
        this.isLoading.set(false);
      }
    });
  }

  eliminarPaciente(paciente: Paciente) {
    this.pacienteToDelete.set(paciente);
    this.showModal.set(true);
  }

  confirmarEliminar() {
    const paciente = this.pacienteToDelete();
    if (paciente) {
      this.pacienteService.deletePaciente(paciente.Cedula, paciente.Representado || '00').subscribe({
        next: () => {
          this.cargarPacientes(); // Recargar la lista
          this.showModal.set(false);
          this.pacienteToDelete.set(null);
        },
        error: (err) => {
          console.error('Error al eliminar paciente:', err);
          alert('No se pudo eliminar el paciente.');
          this.showModal.set(false);
          this.pacienteToDelete.set(null);
        }
      });
    }
  }

  cancelarEliminar() {
    this.showModal.set(false);
    this.pacienteToDelete.set(null);
  }

  activarPaciente(paciente: Paciente) {
    this.pacienteToActivate.set(paciente);
    this.showActivateModal.set(true);
  }

  confirmarActivar() {
    const paciente = this.pacienteToActivate();
    if (paciente) {
      this.pacienteService.reactivarPaciente(paciente.Cedula, paciente.Representado || '00').subscribe({
        next: () => {
          this.cargarPacientes();
          this.showActivateModal.set(false);
          
          // Mostrar toast de éxito
          this.successMessage.set(`¡${paciente.Nombre} ha sido reactivado exitosamente!`);
          this.showSuccessToast.set(true);
          this.pacienteToActivate.set(null);
          
          // Auto-ocultar después de 4 segundos
          setTimeout(() => this.showSuccessToast.set(false), 4000);
        },
        error: (err) => {
          console.error('Error al reactivar paciente:', err);
          this.showActivateModal.set(false);
          this.pacienteToActivate.set(null);
          this.errorModalMessage.set('No se pudo reactivar el paciente. Verifique la conexión con el servidor e intente nuevamente.');
          this.showErrorModal.set(true);
        }
      });
    }
  }

  cancelarActivar() {
    this.showActivateModal.set(false);
    this.pacienteToActivate.set(null);
  }

  dismissSuccessToast() {
    this.showSuccessToast.set(false);
  }

  dismissErrorModal() {
    this.showErrorModal.set(false);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  updateSearchTerm(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1); // Volver a la primera página al buscar
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
