import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DirectorioService } from '../../../../core/services/directorio';

@Component({
  selector: 'app-proveedores-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './proveedores-form.html',
  styleUrl: './proveedores-form.scss'
})
export class ProveedoresForm implements OnInit {
  private fb = inject(FormBuilder);
  private directorioService = inject(DirectorioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  provForm: FormGroup;
  isEditMode = false;
  codigoProveedor: string | null = null;
  isSaving = false;

  constructor() {
    this.provForm = this.fb.group({
      CodigoProveedor: ['', Validators.required],
      NombreProveedor: ['', Validators.required],
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
        this.codigoProveedor = id;
        this.cargarProveedor(id);
      }
    });
  }

  cargarProveedor(id: string) {
    this.directorioService.getProveedores().subscribe({
      next: (provs) => {
        const prov = provs.find(p => p.CodigoProveedor === id);
        if (prov) {
          this.provForm.patchValue(prov);
          this.provForm.get('CodigoProveedor')?.disable();
        }
      },
      error: () => alert('Error cargando datos del proveedor')
    });
  }

  guardar() {
    if (this.provForm.invalid) {
      this.provForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.provForm.getRawValue();

    if (this.isEditMode) {
      this.directorioService.updateProveedor(this.codigoProveedor!, formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/directorio/proveedores']);
        },
        error: () => {
          this.isSaving = false;
          alert('Error actualizando proveedor');
        }
      });
    } else {
      this.directorioService.createProveedor(formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/directorio/proveedores']);
        },
        error: () => {
          this.isSaving = false;
          alert('Error creando proveedor');
        }
      });
    }
  }
}
