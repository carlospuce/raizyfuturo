import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal.html',
  styleUrl: './principal.css'
})
export class Principal {
  faqAbierto: number = 1; // AGREGAR ESTA PROPIEDAD - FAQ 1 abierto por defecto
  esMovil: boolean = false;
  menuAbierto = false;
  
  constructor(private router: Router) {
    this.verificarSiEsMovil();
  }
  
  // Verificar si es dispositivo móvil
  private verificarSiEsMovil(): void {
    this.esMovil = window.innerWidth <= 768;
  }
  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  // Función para empezar la guía
  empezar() {
    console.log('Comenzando guía de emprendimiento...');
    
    // Efecto visual en el botón
    const boton = document.querySelector('.btn-comenzar');
    if (boton) {
      boton.classList.add('presionado');
      setTimeout(() => {
        this.router.navigate(['/eleccion']);
      }, 300);
    } else {
      this.router.navigate(['/eleccion']);
    }
  }
  
  // Función para toggle del menú hamburguesa
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (this.menuAbierto) {
      navMenu?.classList.add('active');
      hamburger?.classList.add('active');
    } else {
      navMenu?.classList.remove('active');
      hamburger?.classList.remove('active');
    }
  }
  toggleFaq(index: number): void {
    if (this.faqAbierto === index) {
      this.faqAbierto = 0; // Cierra si ya está abierto
    } else {
      this.faqAbierto = index; // Abre la nueva pregunta
    }
  }
  
}