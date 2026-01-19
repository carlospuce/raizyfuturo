import { Injectable } from '@angular/core';

export interface RespuestasUsuario {
  dineroInicial: number;
  mesesTrabajo: number;
  gastosMensuales: number;
  ingresosMensuales: number;
  mesesSinIngreso: number;
}

export interface Emprendimiento {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private emprendimientoSeleccionado: Emprendimiento | null = null;
  private respuestas: RespuestasUsuario | null = null;

  constructor() { }

  setEmprendimiento(emprendimiento: Emprendimiento) {
    this.emprendimientoSeleccionado = emprendimiento;
  }

  getEmprendimiento(): Emprendimiento | null {
    return this.emprendimientoSeleccionado;
  }

  setRespuestas(respuestas: RespuestasUsuario) {
    this.respuestas = respuestas;
  }

  getRespuestas(): RespuestasUsuario | null {
    return this.respuestas;
  }

  limpiarDatos() {
    this.emprendimientoSeleccionado = null;
    this.respuestas = null;
  }
}