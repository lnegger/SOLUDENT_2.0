import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './paciente-form.html',
  styleUrls: ['./paciente-form.scss']
})
export class PacienteForm implements OnInit {
  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pacienteForm: FormGroup;
  isEditing = signal(false);
  isReadOnly = signal(false); // true cuando el paciente está eliminado/inactivo
  currentRepresentado = '';
  isSubmitting = signal(false);
  isUploading = signal(false);
  errorMessage = signal('');
  fotoPreview: string | ArrayBuffer | null = null;
  apiBaseUrl = this.pacienteService.apiBaseUrl;

  constructor() {
    this.pacienteForm = this.fb.group({
      es_dependiente: [false],
      Cedula: ['', [Validators.required, Validators.pattern(/^[V|E|J|P|G][0-9]{7,9}$/)]],
      Nombre: ['', Validators.required],
      NombreRepresentante: [''],
      FechaNacimiento: [''],
      NivelEducativo: [0],
      Sexo: [0], // 0: Femenino, 1: Masculino
      GrupoSanguineo: [0],
      FactorRH: [0],
      Activo: [1],
      EstadoCivil: [0],
      Trato: [''],
      DireccionHabitacion: [''],
      DireccionOficina: [''],
      TelefHabita1: [''],
      TelefHabita2: [''],
      TelefOficina1: [''],
      TelefOficina2: [''],
      TelefCelular: [''],
      CorreoElectronico: ['', Validators.email],
      Recomendado: [''],
      HistoriaClinica: [''],
      Ocupacion: [''],
      TipoPaciente: [1],
      ObservacionPresupuesto: [''],
      ArchivoFoto: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const representado = this.route.snapshot.paramMap.get('representado');
    if (id && representado) {
      this.isEditing.set(true);
      this.currentRepresentado = representado;
      this.loadPaciente(id, representado);
    }
    
    // Si marcamos es_dependiente, podemos autollenar algo u obligar a no editar cedula, etc.
  }

  loadPaciente(cedula: string, representado: string) {
    this.pacienteService.getPaciente(cedula, representado).subscribe({
      next: (paciente) => {
        // Formatear la fecha para el input type="date" (YYYY-MM-DD)
        if (paciente.FechaNacimiento) {
          paciente.FechaNacimiento = paciente.FechaNacimiento.split('T')[0];
        }
        this.pacienteForm.patchValue(paciente);
        
        if (paciente.ArchivoFoto) {
           this.fotoPreview = this.apiBaseUrl + paciente.ArchivoFoto;
        }
        // Si es edición, bloqueamos si es titular o dependiente
        this.pacienteForm.get('es_dependiente')?.setValue(paciente.Representado !== '00' && paciente.Representado !== '0');
        if(this.isEditing()) {
           this.pacienteForm.get('es_dependiente')?.disable();
           this.pacienteForm.get('Cedula')?.disable();
        }
        
        // Si el paciente está inactivo (eliminado), poner en modo solo lectura
        if (paciente.Activo === 0) {
          this.isReadOnly.set(true);
          this.pacienteForm.disable();
        }
      },
      error: (err) => {
        console.error('Error al cargar paciente:', err);
        this.errorMessage.set('No se pudo cargar la información del paciente.');
      }
    });
  }

  onSubmit() {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formData = this.pacienteForm.getRawValue();

    if (this.isEditing()) {
      const cedula = this.route.snapshot.paramMap.get('id')!;
      this.pacienteService.updatePaciente(cedula, this.currentRepresentado, formData).subscribe({
        next: () => {
          this.router.navigate(['/pacientes']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.errorMessage.set('Error al actualizar el paciente. Verifique los datos.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.pacienteService.createPaciente(formData).subscribe({
        next: () => {
          this.router.navigate(['/pacientes']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.errorMessage.set('Error al crear el paciente. ¿Cédula duplicada?');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Vista previa local
      const reader = new FileReader();
      reader.onload = e => this.fotoPreview = reader.result;
      reader.readAsDataURL(file);

      // Subir al servidor
      this.isUploading.set(true);
      this.pacienteService.uploadFoto(file).subscribe({
        next: (res) => {
          this.pacienteForm.patchValue({ ArchivoFoto: res.path });
          this.isUploading.set(false);
        },
        error: (err) => {
          console.error('Error uploading file', err);
          this.errorMessage.set('Error al subir la imagen.');
          this.isUploading.set(false);
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  checkTitular() {
    if (this.isEditing()) return; // No chequear en edición porque ya está cargado
    
    const isDep = this.pacienteForm.get('es_dependiente')?.value;
    const cedula = this.pacienteForm.get('Cedula')?.value;
    
    if (isDep && cedula && cedula.length >= 7) {
      this.pacienteService.getPaciente(cedula, '00').subscribe({
        next: (titular) => {
          this.pacienteForm.patchValue({ NombreRepresentante: titular.Nombre });
          this.pacienteForm.get('Cedula')?.setErrors(null);
          this.errorMessage.set('');
        },
        error: (err) => {
          this.pacienteForm.patchValue({ NombreRepresentante: '' });
          this.pacienteForm.get('Cedula')?.setErrors({ titularNoExiste: true });
          this.errorMessage.set('El paciente representante no existe en el sistema. Registre al titular primero.');
        }
      });
    } else if (!isDep) {
      // Limpiar errores si no es dependiente
      if (this.pacienteForm.get('Cedula')?.hasError('titularNoExiste')) {
        this.pacienteForm.get('Cedula')?.setErrors(null);
        this.errorMessage.set('');
      }
      this.pacienteForm.patchValue({ NombreRepresentante: '' });
    }
  }
}
