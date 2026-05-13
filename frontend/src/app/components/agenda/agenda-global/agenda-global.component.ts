import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DateSelectArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { CitaService, Cita } from '../../../core/services/cita.service';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../../core/services/paciente.service';
import { Paciente } from '../../../core/models/paciente.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agenda-global',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './agenda-global.component.html',
  styleUrls: ['./agenda-global.scss']
})
export class AgendaGlobalComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin
    ],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    slotMinTime: '07:00:00',
    slotMaxTime: '20:00:00',
    // Formato de 12 horas para la columna de tiempos
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    // Formato de 12 horas dentro de los eventos
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // Permitir redimensionar eventos para ajustar duración
    eventResizableFromStart: false,
    events: [],
    // Callbacks definidos como arrow functions para mantener el contexto de 'this'
    eventClick: (clickInfo: EventClickArg) => this.handleEventClick(clickInfo),
    select: (selectInfo: DateSelectArg) => this.handleDateSelect(selectInfo),
    eventDrop: (dropInfo: any) => this.handleEventDrop(dropInfo),
    eventResize: (resizeInfo: any) => this.handleEventResize(resizeInfo)
  };

  showModal = false;
  modalMode: 'CREATE' | 'EDIT' = 'CREATE';
  pacientes: Paciente[] = [];
  
  // Modal de confirmación de eliminación
  showDeleteConfirm = false;
  deleteConfirmData: { nombre: string; fecha: string; hora: string } = { nombre: '', fecha: '', hora: '' };
  // Datos pendientes para confirmar drag & drop
  pendingDropInfo: any = null;
  showMoveConfirm = false;
  moveConfirmData: { fecha: string; hora: string } = { fecha: '', hora: '' };
  
  selectedCompany = '01';
  empresaNroSillas = 3;
  
  // Form fields
  citaForm = {
    fecha: '',
    hora: '',
    horaFin: '',
    silla: 1,
    cedula: '',
    representado: '',
    paciente_str: '', // Para guardar la concatenación de cedula|representado
    motivo: '',
    confirmada: false
  };

  // Keep track of original event data when editing
  originalEventData: any = null;

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.selectedCompany = localStorage.getItem('selectedCompany') || '01';
    this.loadEmpresaConfig();
    this.loadPacientes();
  }

  ngAfterViewInit() {
    // Cargar citas después de que el calendario esté montado
    setTimeout(() => this.loadCitas(), 100);
  }

  loadPacientes() {
    this.pacienteService.getPacientes().subscribe(data => {
      // Solo mostrar pacientes activos en el selector de citas
      this.pacientes = data.filter(p => p.Activo === 1);
    });
  }

  loadEmpresaConfig() {
    if (!this.selectedCompany) {
      this.empresaNroSillas = 3;
      return;
    }

    this.http.get<any[]>('http://127.0.0.1:8000/api/empresas').subscribe({
      next: empresas => {
        const empresa = empresas.find(e => e.CodigoEmpresa === this.selectedCompany);
        this.empresaNroSillas = empresa?.NroSillas ?? 3;
      },
      error: () => {
        this.empresaNroSillas = 3;
      }
    });
  }

  get sillaOptions(): number[] {
    return Array.from({ length: Math.max(1, this.empresaNroSillas) }, (_, i) => i + 1);
  }

  loadCitas() {
    this.citaService.getTodasLasCitas().subscribe(citas => {
      const calendarApi = this.calendarComponent?.getApi();
      if (calendarApi) {
        // Limpiar eventos existentes
        calendarApi.removeAllEvents();
        
        // Agregar nuevos eventos
        citas.forEach(c => {
          const horaFin = c.HoraFin || this.addMinutes(c.HoraCita, 30);
          // Colores por silla
          const sillaColors: Record<number, string> = {
            1: '#3b82f6', // Azul
            2: '#10b981', // Verde
            3: '#f59e0b', // Naranja
            4: '#ef4444', // Rojo
            5: '#8b5cf6'  // Violeta
          };
          const backgroundColor = sillaColors[c.Silla] || '#6b7280'; // Gris por defecto
          
          calendarApi.addEvent({
            id: `${c.FechaCita}|${c.HoraCita}|${c.Silla}`,
            title: `${c.NombrePaciente || 'Paciente'} - ${c.Motivo || 'Cita'} (Silla ${c.Silla})`,
            start: `${c.FechaCita}T${c.HoraCita}`,
            end: `${c.FechaCita}T${horaFin}`,
            backgroundColor: backgroundColor,
            extendedProps: { ...c }
          });
        });
      }
    });
  }

  addMinutes(time: string, minsToAdd: number): string {
    if(!time) return '00:00:00';
    const pieces = time.split(':');
    if(pieces.length < 2) return time;
    let mins = parseInt(pieces[0]) * 60 + parseInt(pieces[1]) + minsToAdd;
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  }

  openNuevaCitaModal() {
    this.modalMode = 'CREATE';
    this.citaForm = {
      fecha: new Date().toISOString().split('T')[0],
      hora: '08:00',
      horaFin: '08:30',
      silla: 1,
      cedula: '',
      representado: '',
      paciente_str: '',
      motivo: '',
      confirmada: false
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    
    const startStr = selectInfo.startStr;
    const endStr = selectInfo.endStr;
    
    // Open modal to create event
    this.modalMode = 'CREATE';
    this.citaForm = {
      fecha: startStr.split('T')[0],
      hora: startStr.includes('T') ? startStr.split('T')[1].substring(0,5) : '08:00',
      horaFin: endStr.includes('T') ? endStr.split('T')[1].substring(0,5) : '08:30',
      silla: 1,
      cedula: '',
      representado: '',
      paciente_str: '',
      motivo: '',
      confirmada: false
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  handleEventClick(clickInfo: EventClickArg) {
    const c = clickInfo.event.extendedProps as Cita;
    this.modalMode = 'EDIT';
    this.originalEventData = c;
    const horaFin = c.HoraFin || this.addMinutes(c.HoraCita, 30);
    this.citaForm = {
      fecha: c.FechaCita,
      hora: c.HoraCita?.substring(0,5),
      horaFin: horaFin?.substring(0,5),
      silla: c.Silla,
      cedula: c.CedulaPaciente,
      representado: c.Representado,
      paciente_str: `${c.CedulaPaciente}|${c.Representado}`,
      motivo: c.Motivo || '',
      confirmada: c.Confirmada
    };
    this.showModal = true;
    this.cdr.detectChanges();
  }

  handleEventDrop(dropInfo: any) {
    const c = dropInfo.event.extendedProps as Cita;
    const newStart = dropInfo.event.startStr;
    const newFecha = newStart.split('T')[0];
    const newHora = newStart.includes('T') ? newStart.split('T')[1].substring(0,8) : c.HoraCita;
    
    // Mostrar modal de confirmación en vez de alert
    this.pendingDropInfo = dropInfo;
    this.moveConfirmData = { fecha: newFecha, hora: newHora };
    this.showMoveConfirm = true;
    this.cdr.detectChanges();
  }

  confirmMove() {
    const dropInfo = this.pendingDropInfo;
    const c = dropInfo.event.extendedProps as Cita;
    const newFecha = this.moveConfirmData.fecha;
    const newHora = this.moveConfirmData.hora;
    
    // Calcular nueva HoraFin manteniendo la duración original
    let horaFin = c.HoraFin;
    if (c.HoraCita && horaFin) {
      const origParts = c.HoraCita.split(':');
      const finParts = horaFin.split(':');
      const duracionMins = (parseInt(finParts[0]) * 60 + parseInt(finParts[1])) - (parseInt(origParts[0]) * 60 + parseInt(origParts[1]));
      horaFin = this.addMinutes(newHora, duracionMins);
    }

    const newCita: Cita = {
      ...c,
      FechaCita: newFecha,
      HoraCita: newHora,
      HoraFin: horaFin
    };
    
    this.citaService.deleteCita(c.FechaCita, c.HoraCita, c.Silla).subscribe({
      next: () => {
        this.citaService.createCita(newCita).subscribe(() => {
          this.showMoveConfirm = false;
          this.pendingDropInfo = null;
          this.loadCitas();
          this.cdr.detectChanges();
        });
      },
      error: () => {
        dropInfo.revert();
        this.showMoveConfirm = false;
        this.pendingDropInfo = null;
        this.cdr.detectChanges();
      }
    });
  }

  cancelMove() {
    if (this.pendingDropInfo) {
      this.pendingDropInfo.revert();
    }
    this.showMoveConfirm = false;
    this.pendingDropInfo = null;
    this.cdr.detectChanges();
  }

  handleEventResize(resizeInfo: any) {
    const c = resizeInfo.event.extendedProps as Cita;
    const newEndStr = resizeInfo.event.endStr;
    const newHoraFin = newEndStr.includes('T') ? newEndStr.split('T')[1].substring(0,8) : c.HoraFin;
    
    const updatedCita: Cita = {
      ...c,
      HoraFin: newHoraFin
    };
    
    this.citaService.updateCita(updatedCita).subscribe({
      next: () => this.loadCitas(),
      error: () => resizeInfo.revert()
    });
  }

  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }

  saveCita() {
    if (this.citaForm.paciente_str) {
      const parts = this.citaForm.paciente_str.split('|');
      this.citaForm.cedula = parts[0];
      this.citaForm.representado = parts[1];
    }
    
    if(!this.citaForm.cedula) {
      alert("Seleccione un paciente");
      return;
    }

    // Asegurar formato HH:mm:ss
    const horaInicio = this.citaForm.hora.length === 5 ? this.citaForm.hora + ':00' : this.citaForm.hora;
    const horaFin = this.citaForm.horaFin.length === 5 ? this.citaForm.horaFin + ':00' : this.citaForm.horaFin;

    const nuevaCita: Cita = {
      CodCia: '01',
      FechaCita: this.citaForm.fecha,
      HoraCita: horaInicio,
      HoraFin: horaFin,
      Silla: this.citaForm.silla,
      CedulaPaciente: this.citaForm.cedula,
      Representado: this.citaForm.representado,
      Motivo: this.citaForm.motivo,
      Confirmada: this.citaForm.confirmada
    };

    if (this.modalMode === 'CREATE') {
      this.citaService.createCita(nuevaCita).subscribe(() => {
        this.closeModal();
        this.loadCitas();
      });
    } else {
      const o = this.originalEventData;
      if (o.FechaCita !== nuevaCita.FechaCita || o.HoraCita !== nuevaCita.HoraCita || o.Silla !== nuevaCita.Silla || o.CedulaPaciente !== nuevaCita.CedulaPaciente) {
        // Drop and recreate
        this.citaService.deleteCita(o.FechaCita, o.HoraCita, o.Silla).subscribe(() => {
          this.citaService.createCita(nuevaCita).subscribe(() => {
            this.closeModal();
            this.loadCitas();
          });
        });
      } else {
        // Just Update
        this.citaService.updateCita(nuevaCita).subscribe(() => {
          this.closeModal();
          this.loadCitas();
        });
      }
    }
  }

  // Abre el modal de confirmación de eliminación (NO usa alert/confirm del navegador)
  deleteCita() {
    const o = this.originalEventData;
    const pacienteNombre = o.NombrePaciente || o.CedulaPaciente || 'Desconocido';
    const fecha = o.FechaCita;
    const hora = o.HoraCita;
    this.deleteConfirmData = { nombre: pacienteNombre, fecha, hora };
    this.showDeleteConfirm = true;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    const o = this.originalEventData;
    this.citaService.deleteCita(o.FechaCita, o.HoraCita, o.Silla).subscribe(() => {
      this.showDeleteConfirm = false;
      this.closeModal();
      this.loadCitas();
    });
  }

  formatFecha(fecha: string): string {
    if (!fecha) {
      return '';
    }
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  formatHora12(hora: string): string {
    if (!hora) {
      return '';
    }
    const [hourPart, minutePart] = hora.split(':');
    const hour = parseInt(hourPart, 10);
    const minute = minutePart ? minutePart.padStart(2, '0') : '00';
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute} ${period}`;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.cdr.detectChanges();
  }
}
