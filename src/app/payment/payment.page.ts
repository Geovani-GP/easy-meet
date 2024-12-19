import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { TranslationService } from '../services/translation.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit, AfterViewInit, AfterViewChecked {
  stripe: Stripe | null = null;
  cardElement: StripeCardElement | null = null;
  @ViewChild('cardElementRef', { static: false }) cardElementRef!: ElementRef;
  paymentData: any = {};
  amount: number = 0; // Añadido para el monto del pago
  stripeInitialized: boolean = false; // Añadido para evitar múltiples inicializaciones


  constructor(private translationService: TranslationService) { }
  async ngOnInit() {
    try {
      // Cambia la clave de API a la clave de prueba
      this.stripe = await loadStripe('pk_test_51PHbVtP5EhZ3kVv2zN2k2KX872DDWL2wZxaFw704yFYTkvQZNORDy7oJvHECv27ioyvfpmColwI7k4EFKzBQ6guL00Hg0msNKb');
      if (this.stripe) {
        console.log('Stripe cargado correctamente.');
      } else {
        console.error('Stripe no se pudo cargar.');
      }
    } catch (error) {
      console.error('Error al cargar Stripe:', error);
    }
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit: Verificando inicialización de Stripe y cardElementRef');
  }

  ngAfterViewChecked() {
    if (this.stripe && this.cardElementRef && !this.stripeInitialized) {
      this.initializeStripe();
      this.stripeInitialized = true;
    }
  }

  async initializeStripe() {
    console.log('initializeStripe: Iniciando inicialización de Stripe');
    if (this.stripe && this.cardElementRef) {
      const elements = this.stripe.elements();
      const style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      };
      this.cardElement = elements.create('card', { style });
      try {
        this.cardElement.mount(this.cardElementRef.nativeElement);
        console.log('initializeStripe: Elemento de tarjeta montado correctamente.');
      } catch (mountError) {
        console.error('initializeStripe: Error al montar el elemento de tarjeta:', mountError);
      }
    } else {
      console.error('initializeStripe: Stripe o cardElementRef no están inicializados');
    }
  }

  async processStripePayment() {
    console.log('processStripePayment: Procesando pago con Stripe');
    if (!this.stripe || !this.cardElement) {
      console.error('processStripePayment: Stripe o el elemento de la tarjeta no están inicializados.');
      return;
    }

    const { token, error } = await this.stripe.createToken(this.cardElement);
    if (error) {
      console.error('processStripePayment: Error creando el token:', error);
    } else {
      console.log('processStripePayment: Token creado:', token);
      // Aquí puedes enviar el token a tu servidor para procesar el pago
    }
  }

  processPayment() {
    console.log('processPayment: Procesando pago con método:', this.paymentData.method);
    switch (this.paymentData.method) {
      case 'stripe':
        this.handleStripePayment();
        break;
      case 'deposit':
        this.processPayment();
        break;
      case 'transfer':
        this.processPayment();
        break;
      default:
        console.error('processPayment: Método de pago no soportado:', this.paymentData.method);
    }
  }


  async handleStripePayment() {
    console.log('handleStripePayment: Iniciando pago con Stripe');
    if (this.cardElementRef && this.cardElementRef.nativeElement) {
      await this.processStripePayment();
    } else {
      console.error('handleStripePayment: cardElementRef no está inicializado');
    }
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }
}