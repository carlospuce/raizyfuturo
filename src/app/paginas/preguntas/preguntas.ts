import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatosService } from '../../servicios/datos.service';

@Component({
    selector: 'app-preguntas',
    standalone: true,
    imports: [CommonModule, FormsModule], // Agregar FormsModule
    templateUrl: './preguntas.html',
    styleUrl: './preguntas.css'
})
export class Preguntas {
    preguntaActual: number = 0;
    mensajeError: string = '';

    // Modelo de respuestas
    respuestas = {
        dineroInicial: 0,
        mesesTrabajo: 0,
        gastosMensuales: 0,
        ingresosMensuales: 0,
        mesesSinIngreso: 0
    };

    // Configuración de preguntas
    preguntas = [
        {
            titulo: '¿Cuánto dinero necesitas para empezar?',
            descripcion: 'Piensa en todo lo que necesitas comprar o preparar al inicio'
        },
        {
            titulo: '¿Durante cuántos meses piensas trabajar en esto?',
            descripcion: 'Considera el tiempo que le dedicarás a tu emprendimiento'
        },
        {
            titulo: '¿Cuánto gastarás cada mes para mantenerlo?',
            descripcion: 'Materiales, transporte, servicios y otros gastos mensuales'
        },
        {
            titulo: '¿Cuánto dinero esperas ganar cada mes?',
            descripcion: 'Una estimación realista de tus ingresos mensuales'
        },
        {
            titulo: '¿Habrá meses donde no recibirás dinero?',
            descripcion: 'Al inicio o en temporada baja, puede que no haya ingresos'
        }
    ];

    constructor(private router: Router, private datosService: DatosService) { }

    // Navegación entre preguntas
    siguientePregunta() {
        if (!this.respuestaValida()) {
            return;
        }

        if (this.preguntaActual < this.preguntas.length - 1) {
            this.preguntaActual++;
            this.mensajeError = '';
        } else {
            // Última pregunta - guardar respuestas y ir a resultados
            this.datosService.setRespuestas(this.respuestas);
            this.router.navigate(['/resultados']);
        }
    }

    preguntaAnterior() {
        if (this.preguntaActual > 0) {
            this.preguntaActual--;
            this.mensajeError = '';
        } else {
            // Si está en la primera pregunta, volver a elección
            this.volver();
        }
    }

    irAPregunta(indice: number) {
        // Solo permitir ir a preguntas ya respondidas
        let puedeNavegar = true;
        for (let i = 0; i < indice; i++) {
            if (!this.validarPregunta(i)) {
                puedeNavegar = false;
                break;
            }
        }

        if (puedeNavegar) {
            this.preguntaActual = indice;
            this.mensajeError = '';
        } else {
            this.mensajeError = 'Por favor responde las preguntas anteriores primero';
        }
    }

    // Validaciones
    respuestaValida(): boolean {
        return this.validarPregunta(this.preguntaActual);
    }

    validarPregunta(indice: number): boolean {
        switch (indice) {
            case 0: // Dinero inicial
                return this.respuestas.dineroInicial > 0 &&
                    this.respuestas.dineroInicial <= 100000; // Límite razonable

            case 1: // Meses de trabajo
                return this.respuestas.mesesTrabajo >= 1 &&
                    this.respuestas.mesesTrabajo <= 60; // Máximo 5 años

            case 2: // Gastos mensuales
                return this.respuestas.gastosMensuales >= 0;

            case 3: // Ingresos mensuales
                return this.respuestas.ingresosMensuales >= 0;

            case 4: // Meses sin ingreso
                return this.respuestas.mesesSinIngreso >= 0 &&
                    this.respuestas.mesesSinIngreso <= (this.respuestas.mesesTrabajo || 60);

            default:
                return false;
        }
    }

    validarRespuestas(): boolean {
        for (let i = 0; i < this.preguntas.length; i++) {
            if (!this.validarPregunta(i)) {
                return false;
            }
        }
        return true;
    }

    // Funciones de ayuda
    establecerMesesInicio() {
        if (this.respuestas.mesesTrabajo > 0) {
            // Establece 2 meses como inicio, máximo 3 o 20% del total
            const mesesSugeridos = Math.min(3, Math.max(1, Math.floor(this.respuestas.mesesTrabajo * 0.2)));
            this.respuestas.mesesSinIngreso = mesesSugeridos;
        }
    }

    volver() {
        this.router.navigate(['/eleccion']);
    }
}