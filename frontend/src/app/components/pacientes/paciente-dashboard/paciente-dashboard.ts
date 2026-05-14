import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-dashboard.html',
  styleUrls: ['./paciente-dashboard.scss']
})
export class PacienteDashboard implements OnInit {
  private route = inject(ActivatedRoute);
  private pacienteService = inject(PacienteService);

  pacienteId = '';
  representado = '';
  pacienteNombre = signal<string>('Cargando paciente...');
  pacienteActivo = signal<boolean>(true);
  
  // Navigation tabs definition
  allTabs = [
    { path: 'perfil', label: 'Perfil', icon: '👤' },
    { path: 'odontograma', label: 'Odontograma', icon: '🦷' },
    { path: 'citas', label: 'Citas', icon: '📅️' },
    { path: 'tratamientos', label: 'Tratamientos', icon: '📝' },
    { path: 'abonos', label: 'Abonos', icon: '💳' }
  ];

  // Filtrar tabs según estado del paciente (inactivos no ven Citas)
  tabs = computed(() => {
    if (!this.pacienteActivo()) {
      return this.allTabs.filter(t => t.path !== 'citas');
    }
    return this.allTabs;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pacienteId = params.get('id') || '';
      this.representado = params.get('representado') || '00';
      this.cargarDatosPaciente();
    });
  }

  cargarDatosPaciente() {
    if (this.pacienteId) {
      this.pacienteService.getPaciente(this.pacienteId, this.representado).subscribe({
        next: (paciente) => {
          if (paciente && paciente.Nombre) {
            this.pacienteNombre.set(paciente.Nombre);
            this.pacienteActivo.set(paciente.Activo === 1);
          } else {
            this.pacienteNombre.set('Paciente no encontrado');
          }
        },
        error: () => {
          this.pacienteNombre.set('Error al cargar paciente');
        }
      });
    }
  }
}
