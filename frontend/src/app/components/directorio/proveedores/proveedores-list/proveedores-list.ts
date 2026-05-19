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
      error: (err) => {
        this.errorMessage.set('Error cargando proveedores');
        this.isLoading.set(false);
      }
    });
  }

  eliminar(prov: Proveedor) {
    if (confirm(`¿Está seguro de eliminar el proveedor ${prov.NombreProveedor}?`)) {
      this.directorioService.deleteProveedor(prov.CodigoProveedor).subscribe({
        next: () => this.cargarProveedores(),
        error: () => alert('Error eliminando proveedor')
      });
    }
  }
}
