import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ItemTratamiento {
  id: number;
  descripcion: string;
  detalle: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  icon: string;
}

interface Abono {
  id: number;
  descripcion: string;
  metodo: string;
  fecha: string;
  monto: number;
}

@Component({
  selector: 'app-paciente-tratamientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-tratamientos.html',
  styleUrls: ['./paciente-tratamientos.scss']
})
export class PacienteTratamientosComponent implements OnInit {
  private route = inject(ActivatedRoute);

  pacienteId = '';
  representado = '';
  
  // Mock data based on the source screen
  items = signal<ItemTratamiento[]>([
    {
      id: 1,
      descripcion: 'Resina Compuesta (Multi-superficie)',
      detalle: 'Dientes #14, #15 - Restauración posterior',
      cantidad: 2,
      precioUnitario: 185.00,
      total: 370.00,
      icon: 'dentistry'
    },
    {
      id: 2,
      descripcion: 'Examen Oral Integral',
      detalle: 'Diagnóstico completo y serie de rayos X',
      cantidad: 1,
      precioUnitario: 95.00,
      total: 95.00,
      icon: 'clinical_notes'
    },
    {
      id: 3,
      descripcion: 'Profilaxis - Adulto',
      detalle: 'Limpieza estándar y pulido',
      cantidad: 1,
      precioUnitario: 120.00,
      total: 120.00,
      icon: 'cleaning_services'
    }
  ]);

  abonos = signal<Abono[]>([
    { id: 1, descripcion: 'Abono Inicial', metodo: 'Zelle', fecha: '10 Oct, 2023', monto: 150.00 },
    { id: 2, descripcion: 'Abono Prep. Corona', metodo: 'Visa', fecha: '15 Sep, 2023', monto: 600.00 }
  ]);

  montoAbonar = 345.00;
  metodoSeleccionado = 'Efectivo';

  subtotal = 585.00;
  iva = 0.00;
  seguro = 240.00;
  totalPagar = 345.00;

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.pacienteId = params.get('id') || '';
      this.representado = params.get('representado') || '00';
    });
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  procesarAbono() {
    console.log(`Procesando abono de ${this.montoAbonar} vía ${this.metodoSeleccionado}`);
    // Aquí iría la lógica para llamar al backend
    alert(`Abono de $${this.montoAbonar} procesado exitosamente.`);
  }
}
