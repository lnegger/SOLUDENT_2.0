import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DirectorioService } from '../../../../core/services/directorio';

@Component({
  selector: 'app-colegas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './colegas-form.html',
  styleUrl: './colegas-form.scss'
})
export class ColegasForm implements OnInit {
  private fb = inject(FormBuilder);
  private directorioService = inject(DirectorioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  colegaForm: FormGroup;
  isEditMode = false;
  codigoColega: string | null = null;
  isSaving = false;

  constructor() {
    this.colegaForm = this.fb.group({
      CodigoColega: ['', Validators.required],
      NombreColega: ['', Validators.required],
      DireccionHabitacion: [''],
      TelefonoHabitacion1: [''],
      TelefonoHabitacion2: [''],
      DireccionOficina: [''],
      TelefonoOficina1: [''],
      TelefonoOficina2: [''],
      Fax: [''],
      CorreoElectronico: ['', Validators.email],
      TelefonoCelular: [''],
      Especialidad: [''],
      Observacion: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.codigoColega = id;
        this.cargarColega(id);
      }
    });
  }

  cargarColega(id: string) {
    this.directorioService.getColegas().subscribe({
      next: (colegas) => {
        const colega = colegas.find(c => c.CodigoColega === id);
        if (colega) {
          this.colegaForm.patchValue(colega);
          this.colegaForm.get('CodigoColega')?.disable(); // Prevent editing PK
        }
      },
      error: () => alert('Error cargando datos del colega')
    });
  }

  guardar() {
    if (this.colegaForm.invalid) {
      this.colegaForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.colegaForm.getRawValue();

    if (this.isEditMode) {
      this.directorioService.updateColega(this.codigoColega!, formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/directorio/colegas']);
        },
        error: () => {
          this.isSaving = false;
          alert('Error actualizando colega');
        }
      });
    } else {
      this.directorioService.createColega(formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/directorio/colegas']);
        },
        error: () => {
          this.isSaving = false;
          alert('Error creando colega');
        }
      });
    }
  }
}

