import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatosService, Emprendimiento, RespuestasUsuario } from '../../servicios/datos.service';

interface ResultadosCalculados {
  van: number;
  tir: number;
  periodoRecuperacion: number;
  riesgo: 'bajo' | 'medio' | 'alto';
  categoria: 'conveniente' | 'riesgosa' | 'no_recomendable';
  mensajePrincipal: string;
  recomendaciones: string[];
  colorCategoria: string;
  iconoCategoria: string;
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {
  emprendimiento: Emprendimiento | null = null;
  respuestas: RespuestasUsuario | null = null;
  resultados: ResultadosCalculados | null = null;

  constructor(private router: Router, private datosService: DatosService) {}

  ngOnInit() {
    this.emprendimiento = this.datosService.getEmprendimiento();
    this.respuestas = this.datosService.getRespuestas();

    if (!this.emprendimiento || !this.respuestas) {
      // Si no hay datos, redirigir a la página principal
      this.router.navigate(['/principal']);
      return;
    }

    this.calcularResultados();
  }

  calcularResultados() {
    if (!this.respuestas || !this.emprendimiento) return;

    const r = this.respuestas;
    const tipoRiesgo = this.calcularRiesgoEmprendimiento(this.emprendimiento.id);

    // Cálculos financieros básicos
    const van = this.calcularVAN(r);
    const tir = this.calcularTIR(r);
    const periodoRecuperacion = this.calcularPeriodoRecuperacion(r);

    // Determinar categoría
    const categoria = this.determinarCategoria(van, tir, periodoRecuperacion, tipoRiesgo);

    // Generar mensaje y recomendaciones
    const mensajePrincipal = this.generarMensajePrincipal(categoria, this.emprendimiento.titulo);
    const recomendaciones = this.generarRecomendaciones(categoria, r, this.emprendimiento.id);

    this.resultados = {
      van,
      tir,
      periodoRecuperacion,
      riesgo: tipoRiesgo,
      categoria,
      mensajePrincipal,
      recomendaciones,
      colorCategoria: this.getColorCategoria(categoria),
      iconoCategoria: this.getIconoCategoria(categoria)
    };
  }

  private calcularVAN(respuestas: RespuestasUsuario): number {
    const inversionInicial = respuestas.dineroInicial;
    const mesesTrabajo = respuestas.mesesTrabajo;
    const ingresosMensuales = respuestas.ingresosMensuales;
    const gastosMensuales = respuestas.gastosMensuales;
    const mesesSinIngreso = respuestas.mesesSinIngreso;

    // Tasa de descuento mensual (aproximadamente 1% mensual = 12% anual)
    const tasaDescuentoMensual = 0.01;

    let van = -inversionInicial;

    for (let mes = 1; mes <= mesesTrabajo; mes++) {
      let flujoMes = 0;

      if (mes <= mesesSinIngreso) {
        // Meses sin ingreso: solo gastos
        flujoMes = -gastosMensuales;
      } else {
        // Meses con ingreso: ingresos - gastos
        flujoMes = ingresosMensuales - gastosMensuales;
      }

      // Aplicar descuento
      van += flujoMes / Math.pow(1 + tasaDescuentoMensual, mes);
    }

    return Math.round(van);
  }

  private calcularTIR(respuestas: RespuestasUsuario): number {
    // Cálculo simplificado de TIR (tasa interna de retorno)
    // En un caso real, usaríamos un método numérico más preciso
    const van = this.calcularVAN(respuestas);
    const inversionInicial = respuestas.dineroInicial;

    if (van > 0) {
      // TIR aproximada basada en VAN positivo
      const retornoTotal = van + inversionInicial;
      const periodoPromedio = respuestas.mesesTrabajo / 2;
      const tirAnual = (Math.pow(retornoTotal / inversionInicial, 1 / (periodoPromedio / 12)) - 1) * 100;
      return Math.round(tirAnual * 100) / 100;
    } else {
      return 0;
    }
  }

  private calcularPeriodoRecuperacion(respuestas: RespuestasUsuario): number {
    const inversionInicial = respuestas.dineroInicial;
    const ingresosMensuales = respuestas.ingresosMensuales;
    const gastosMensuales = respuestas.gastosMensuales;
    const mesesSinIngreso = respuestas.mesesSinIngreso;

    let acumulado = -inversionInicial;
    let meses = 0;

    while (acumulado < 0 && meses < respuestas.mesesTrabajo) {
      meses++;
      if (meses <= mesesSinIngreso) {
        acumulado -= gastosMensuales;
      } else {
        acumulado += ingresosMensuales - gastosMensuales;
      }
    }

    return meses;
  }

  private calcularRiesgoEmprendimiento(tipo: string): 'bajo' | 'medio' | 'alto' {
    const riesgos: { [key: string]: 'bajo' | 'medio' | 'alto' } = {
      'artesanias': 'bajo',
      'academia': 'bajo',
      'turismo': 'medio',
      'otros': 'medio',
      'recoleccion': 'alto'
    };
    return riesgos[tipo] || 'medio';
  }

  private determinarCategoria(
    van: number,
    tir: number,
    periodoRecuperacion: number,
    riesgo: 'bajo' | 'medio' | 'alto'
  ): 'conveniente' | 'riesgosa' | 'no_recomendable' {

    // Lógica de decisión
    if (van < -1000) {
      return 'no_recomendable';
    }

    if (van > 0 && tir > 15 && periodoRecuperacion <= 12 && riesgo !== 'alto') {
      return 'conveniente';
    }

    if (van > 0 && (riesgo === 'alto' || periodoRecuperacion > 18)) {
      return 'riesgosa';
    }

    if (van > 0) {
      return 'conveniente';
    }

    return 'no_recomendable';
  }

  private generarMensajePrincipal(categoria: string, emprendimiento: string): string {
    const mensajes = {
      'conveniente': `¡Muy buena idea! Tu emprendimiento "${emprendimiento}" tiene números que funcionan bien. ¡Puedes empezar con confianza!`,
      'riesgosa': `Tu emprendimiento "${emprendimiento}" puede funcionar, pero necesitas ser cuidadoso y hacer algunos cambios para que sea más seguro.`,
      'no_recomendable': `Tu emprendimiento "${emprendimiento}" necesita cambios importantes. Mejor revisemos los números juntos antes de empezar.`
    };
    return mensajes[categoria as keyof typeof mensajes] || '';
  }

  private generarRecomendaciones(
    categoria: string,
    respuestas: RespuestasUsuario,
    tipoEmprendimiento: string
  ): string[] {
    const recomendaciones: string[] = [];

    // Recomendaciones generales más simples
    if (respuestas.gastosMensuales > respuestas.ingresosMensuales * 0.8) {
      recomendaciones.push('Tus gastos son muy altos. Trata de gastar menos cada mes, máximo el 80% de lo que piensas ganar.');
    }

    if (respuestas.mesesSinIngreso > 3) {
      recomendaciones.push('Tienes muchos meses sin dinero. Busca formas de ganar algo desde el primer mes.');
    }

    // Recomendaciones por categoría más accesibles
    if (categoria === 'conveniente') {
      recomendaciones.push('¡Felicitaciones! Tu plan está bien hecho. Empieza poco a poco y guarda algo de dinero para emergencias.');
      recomendaciones.push('El dinero que ganes, úsalo con sabiduría para ayudar a tu familia.');
    } else if (categoria === 'riesgosa') {
      recomendaciones.push('Busca gastar menos dinero al inicio o pide ayuda a alguien para empezar.');
      recomendaciones.push('Haz tu emprendimiento más pequeño al principio para probar si funciona.');
      recomendaciones.push('Diversifica: no dependas solo de una cosa, busca varias formas de ganar dinero.');
    } else if (categoria === 'no_recomendable') {
      recomendaciones.push('Tus números necesitan cambiar. Quizás esperas ganar demasiado o gastas muy poco.');
      recomendaciones.push('Habla con alguien que sepa de negocios antes de gastar tu dinero.');
      recomendaciones.push('Considera trabajar más tiempo o buscar socios para compartir los gastos.');
    }

    // Recomendaciones por tipo de emprendimiento más prácticas
    if (tipoEmprendimiento === 'recoleccion') {
      recomendaciones.push('La recolección depende de las estaciones. Guarda comida y dinero para los meses de lluvia.');
    } else if (tipoEmprendimiento === 'turismo') {
      recomendaciones.push('El turismo cambia mucho. Ten un plan B si no vienen muchos visitantes.');
    } else if (tipoEmprendimiento === 'artesanias') {
      recomendaciones.push('Las artesanías requieren tiempo para aprender. Practica mucho antes de vender.');
    }

    // Mensajes motivacionales más relevantes para la comunidad
    recomendaciones.push('El emprendimiento es como sembrar: cuidas hoy para cosechar mañana.');
    recomendaciones.push('Trabaja con honestidad y el dinero bendecirá a tu familia y comunidad.');
    recomendaciones.push('Cada paso que das enseña algo nuevo. No te desanimes si algo no sale bien.');

    return recomendaciones;
  }

  private getColorCategoria(categoria: string): string {
    const colores = {
      'conveniente': '#28a745',
      'riesgosa': '#ffc107',
      'no_recomendable': '#dc3545'
    };
    return colores[categoria as keyof typeof colores] || '#6c757d';
  }

  private getIconoCategoria(categoria: string): string {
    const iconos = {
      'conveniente': '✅',
      'riesgosa': '⚠️',
      'no_recomendable': '❌'
    };
    return iconos[categoria as keyof typeof iconos] || '❓';
  }

  volver() {
    this.router.navigate(['/preguntas']);
  }

  empezarDeNuevo() {
    this.datosService.limpiarDatos();
    this.router.navigate(['/principal']);
  }

  irAI() {
    this.router.navigate(['/ia']);
  }

  // Formateadores para la vista
  formatearMoneda(valor: number): string {
    return `$${valor.toLocaleString('es-ES')}`;
  }

  formatearPorcentaje(valor: number): string {
    return `${valor}%`;
  }
}