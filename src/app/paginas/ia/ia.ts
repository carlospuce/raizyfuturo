import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DatosService, Emprendimiento, RespuestasUsuario } from '../../servicios/datos.service';

interface MensajeChat {
  tipo: 'usuario' | 'ia';
  contenido: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './ia.html',
  styleUrl: './ia.css'
})
export class Ia implements OnInit {
  emprendimiento: Emprendimiento | null = null;
  respuestas: RespuestasUsuario | null = null;
  mensajes: MensajeChat[] = [];
  cargando = false;

  constructor(private router: Router, private datosService: DatosService) {}

  ngOnInit() {
    this.emprendimiento = this.datosService.getEmprendimiento();
    this.respuestas = this.datosService.getRespuestas();

    if (!this.emprendimiento || !this.respuestas) {
      this.router.navigate(['/principal']);
      return;
    }

    this.enviarMensajeInicial();
  }

  enviarMensajeInicial() {
    const mensajeUsuario = this.generarMensajeParaIA();
    this.mensajes.push({
      tipo: 'usuario',
      contenido: mensajeUsuario,
      timestamp: new Date()
    });

    // Simular respuesta de IA
    this.cargando = true;
    setTimeout(() => {
      this.mensajes.push({
        tipo: 'ia',
        contenido: 'Estoy analizando tu información financiera. Aquí tienes una tabla mes a mes basada en tus datos:\n\n' + this.generarTablaMesAMes() + '\n\n**Análisis:**\n\nBasándome en la información proporcionada, veo que tu emprendimiento tiene un VAN de aproximadamente $' + this.calcularVAN() + '. Te recomiendo revisar tus gastos mensuales y considerar estrategias para aumentar los ingresos.',
        timestamp: new Date()
      });
      this.cargando = false;
    }, 2000);
  }

  generarMensajeParaIA(): string {
    if (!this.emprendimiento || !this.respuestas) return '';

    return `Hola IA, necesito que analices mi emprendimiento financiero. Aquí están los detalles:

**Emprendimiento seleccionado:** ${this.emprendimiento.titulo}
**Descripción:** ${this.emprendimiento.descripcion}

**Datos financieros:**
- Dinero inicial: $${this.respuestas.dineroInicial}
- Meses de trabajo: ${this.respuestas.mesesTrabajo}
- Gastos mensuales: $${this.respuestas.gastosMensuales}
- Ingresos mensuales: $${this.respuestas.ingresosMensuales}
- Meses sin ingreso: ${this.respuestas.mesesSinIngreso}

Por favor, crea una tabla mes a mes mostrando el flujo de caja y luego analiza si este emprendimiento es viable.`;
  }

  generarTablaMesAMes(): string {
    if (!this.respuestas) return '';

    let tabla = '| Mes | Ingresos | Gastos | Flujo de Caja | Acumulado |\n|-----|----------|--------|---------------|------------|\n';

    let acumulado = -this.respuestas.dineroInicial;
    for (let mes = 1; mes <= this.respuestas.mesesTrabajo; mes++) {
      const ingresos = mes <= this.respuestas.mesesSinIngreso ? 0 : this.respuestas.ingresosMensuales;
      const gastos = this.respuestas.gastosMensuales;
      const flujo = ingresos - gastos;
      acumulado += flujo;

      tabla += `| ${mes} | $${ingresos} | $${gastos} | $${flujo} | $${acumulado} |\n`;
    }

    return tabla;
  }

  calcularVAN(): number {
    if (!this.respuestas) return 0;

    // Cálculo simplificado de VAN (Valor Actual Neto)
    const tasaDescuento = 0.1; // 10% anual
    let van = -this.respuestas.dineroInicial;

    for (let mes = 1; mes <= this.respuestas.mesesTrabajo; mes++) {
      const ingresos = mes <= this.respuestas.mesesSinIngreso ? 0 : this.respuestas.ingresosMensuales;
      const flujo = ingresos - this.respuestas.gastosMensuales;
      van += flujo / Math.pow(1 + tasaDescuento/12, mes);
    }

    return Math.round(van);
  }

  volver() {
    this.router.navigate(['/resultados']);
  }
}
