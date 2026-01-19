import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatosService, Emprendimiento } from '../../servicios/datos.service';

@Component({
  selector: 'app-eleccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eleccion.html',
  styleUrl: './eleccion.css'
})
export class Eleccion {
  opciones: Emprendimiento[] = [
    {
      id: 'recoleccion',
      titulo: '🌱 Recolección de Frutos silvestres',
      descripcion: 'Recolectar frutos, plantas y recursos naturales del bosque',
      icono: '🌱',
      imagen: '/frutos.png' // Imagen por defecto para recolección
    },
    {
      id: 'artesanias',
      titulo: '🎨 Artesanías Locales',
      descripcion: 'Crear y vender artesanías tradicionales',
      icono: '🎨',
      imagen: '/artesania.png'
    },
    {
      id: 'turismo',
      titulo: '🏞️ Bioturismo Comunitario',
      descripcion: 'Recibir visitantes para mostrar nuestra cultura y naturaleza',
      icono: '🏞️',
      imagen: '/turismo.png'
    },
    {
      id: 'academia',
      titulo: '🏫 Colaboración Académica',
      descripcion: 'Trabajar con investigadores y universidades',
      icono: '🏫',
      imagen: '/investigacion.png'
    },
    {
      id: 'otros',
      titulo: '📦 Otros',
      descripcion: 'Otra actividad o emprendimiento diferente',
      icono: '📦',
      imagen: '/otros.png'
    }
  ];

  opcionSeleccionada: string | null = null;

  constructor(private router: Router, private datosService: DatosService) {}

  seleccionarOpcion(opcionId: string) {
    this.opcionSeleccionada = opcionId;
    console.log('Opción seleccionada:', opcionId);
  }

  continuar() {
    if (this.opcionSeleccionada) {
      // Guardar la selección en el servicio
      const emprendimiento = this.opciones.find(op => op.id === this.opcionSeleccionada);
      if (emprendimiento) {
        this.datosService.setEmprendimiento(emprendimiento);
      }
      // Navegar a la página de preguntas
      this.router.navigate(['/preguntas']);
    } else {
      alert('Por favor, selecciona una opción antes de continuar.');
    }
  }

  volver() {
    this.router.navigate(['/principal']);
  }
}