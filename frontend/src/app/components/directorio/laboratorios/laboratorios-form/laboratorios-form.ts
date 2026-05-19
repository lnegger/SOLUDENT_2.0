import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DirectorioService } from '../../../../core/services/directorio';

@Component({
  selector: 'app-laboratorios-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './laboratorios-form.html',
  styleUrl: './laboratorios-form.scss'
})
export class LaboratoriosForm implements OnInit {
  private fb = inject(FormBuilder);
  private directorioService = inject(DirectorioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  labForm: FormGroup;
  isEditMode = false;
  codigoLaboratorio: string | null = null;
  isSaving = false;

  constructor() {
    this.labForm = this.fb.group({
      CodigoLaboratorio: ['', Validators.required],
      NombreLaboratorio: ['', Validators.required],
      Contacto: [''],
      DireccionOficina: [''],
      TelefonoOficina1: [''],
      TelefonoOficina2: [''],
      Fax: [''],
      CorreoElectronico: ['', Validators.email],
      TelefonoCelular: [''],
      Observacion: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.codigoLaboratorio = id;
        this.cargarLaboratorio(id);
      }
    });
  }

  cargarLaboratorio(id: string) {
    this.directorioService.getLaboratorios().subscribe({
      next: (labs) => {
        const lab = labs.find(l => l.CodigoLaboratorio === id);
        if (lab) {
          this.labForm.patchValue(lab);
          this.labForm.get('CodigoLaboratorio')?.disable();
        }
      },
      error: () => alert('Error cargando datos del laboratorio')
    });
  }

  guardar() {
    if (this.labForm.invalid) {
      this.labForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.labForm.getRawValue();

    if (this.isEditMode) {
      this.directorioService.updateLaboratorio(this.codigoLaboratorio!, formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/directorio/laboratorios']);
        },
        error: () => {
          this.isSaving = false;
          alert('Error actualizando laboratorio');
        }
      });
    } else {
      this.directorioService.createLaboratorio(formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/directorio/laboratorios']);
        },
        error: () => {
          this.isSaving = false;
          alert('Error creando laboratorio');
        }
      });
    }
  }
}
