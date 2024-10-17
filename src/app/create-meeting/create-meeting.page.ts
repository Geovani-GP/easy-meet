import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { environment } from '../../environments/environment'; 
import { TranslationService } from '../services/translation.service';
import { ServicesService } from '../services/services.service';
import { ToastController } from '@ionic/angular';
import { SpinnerService } from '../services/spinner.service';
import { CompressImageService } from '../services/compress-image.service';

declare const google: any; 

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {
  
  titulo: string = '';
  descripcion: string = '';
  fecha: string = '';
  costo: number | null = null; 
  tipo: string = '';
  tema: string = '';
  rangeValues: { lower: number; upper: number } = { lower: 18, upper: 60 }; 
  lowerValue: number = this.rangeValues.lower; 
  upperValue: number = this.rangeValues.upper; 
  direccion: string = ''; 
  isMapModalOpen: boolean = false; 
  imagen: string | null = null; 
  map: any;
  currentLocation: { lat: number; lng: number } | null = null; 
  sugerencias: any[] = [];
  marker: any; 
  intereses: any[] = [];
  usuario: any;
  constructor(private translationService: TranslationService, private servicesService: ServicesService, private toastController: ToastController, private spinnerService: SpinnerService, private compressImageService: CompressImageService) { 
    
    (window as any).initMap = this.initMap.bind(this);
  }

  async ngOnInit() {
    this.usuario =await JSON.parse(localStorage.getItem('EMUser') || '{}');
    console.log(this.usuario);
    this.loadGoogleMaps();
    this.loadInterests();
  }

  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  
  seleccionarSugerencia(sugerencia: any) {
    this.direccion = sugerencia.description; 
    this.sugerencias = []; 
    this.updateMapLocationFromAddress(this.direccion); 
  }

  updateMapLocationFromAddress(direccion: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: direccion }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            this.currentLocation = {
                lat: location.lat(),
                lng: location.lng(),
            };
            console.log('Dirección seleccionada:', direccion);
            console.log('Latitud:', this.currentLocation.lat);
            console.log('Longitud:', this.currentLocation.lng);
            this.updateMapLocation(); 
        } else {
            console.error('No se pudo encontrar la dirección:', status);
        }
    });
  }

  
  updateValues() {
    this.lowerValue = this.rangeValues.lower; 
    this.upperValue = this.rangeValues.upper; 
  }

  buscarDireccion() {
    if (this.direccion) {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: this.direccion }, (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.sugerencias = predictions; 
        } else {
          this.sugerencias = []; 
        }
      });
    } else {
      this.sugerencias = []; 
    }
  }
  
  
  onSubmit() {
    console.log(this.formatDate(this.fecha));
    const meetingData = {
      usuario: this.usuario.payload.uid,
      interes: parseInt(this.tema), 
      tipo: parseInt(this.tipo),
      audicencia:"A", //
      cp: "00000", //
      lugar: this.direccion, 
      titulo: this.titulo,
      fec_hora: this.formatDate(this.fecha),
      costo: this.costo,
      eda_ini: this.rangeValues.lower,
      eda_fin: this.rangeValues.upper, 
      descripcion: this.descripcion,
      latitud: this.currentLocation?.lat, // Añadido: latitud
      longitud: this.currentLocation?.lng  // Añadido: longitud
    };

    console.log('Datos de la reunión:', meetingData);
    
    // Llamar al servicio para crear la reunión
    this.servicesService.crearMeeting(meetingData).subscribe({
      next: async (response) => {
        console.log('Reunión creada exitosamente:', response);

        // Cargar la imagen después de crear la reunión
        if (this.imagen) {
          const uid = response.payload.uid; // Asegúrate de que el UID esté en la respuesta
          const imageBase64 = this.imagen; // La imagen en base64
          await this.servicesService.uploadImage(uid, imageBase64).toPromise();
          console.log('Imagen cargada exitosamente.');
        }

        this.toastController.create({
          message: this.translate('Reunión creada exitosamente.'),
          duration: 2000,
          position: 'bottom'
        }).then(toast => toast.present());
      },
      error: (error) => {
        console.error('Error al crear la reunión:', error);
        this.toastController.create({
          message: this.translate('Error al crear la reunión. Inténtalo de nuevo.'),
          duration: 2000,
          position: 'bottom'
        }).then(toast => toast.present());
      }
    });
  }

  selectedDate: string = new Date().toISOString(); 
  isDatePickerVisible: boolean = false;

  showDatePicker() {
    console.log('showDatePicker');
    this.isDatePickerVisible = !this.isDatePickerVisible; 
    console.log('showDatePicker', this.isDatePickerVisible); 
  }
  
  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    this.fecha = this.selectedDate;
  }

  acceptDate() {
    this.isDatePickerVisible = false; // Oculta el modal
    console.log('Fecha y hora seleccionadas:', this.selectedDate); // Muestra la fecha seleccionada en la consola
    // Aquí puedes agregar cualquier lógica adicional que necesites
  }

  
  showMapModal() {
    this.loadGoogleMaps();
    this.isMapModalOpen = true; 
  }

  
  obtenerCoordenadas() {
    
    console.log('Obteniendo coordenadas...');
    
    this.direccion = 'Dirección seleccionada'; 
    this.isMapModalOpen = false; 
  }

  
  async subirImagen() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl, 
    });
  
    
    if (image.dataUrl) { 
        const response = await fetch(image.dataUrl);
        const blob = await response.blob(); 
        const file = new File([blob], 'imagen_comprimida.jpg', { type: blob.type }); 
        this.imagen = await this.compressImageService.compress(file, 600, 800); 
        console.log('Imagen seleccionada y comprimida:', this.imagen);
    } else {
        console.error('No se pudo obtener la imagen.');
    }
  }

  onMapModalDidPresent() {
    console.log('Modal presentado, cargando Google Maps...');
    this.loadGoogleMaps(); 
    this.getCurrentLocation(); 
  }
  
  initMap() {
    console.log('initMap llamado');
    setTimeout(() => {
      const mapDiv = document.getElementById('map');
      console.log('mapDiv:', mapDiv); 
      if (mapDiv) {
        const mapOptions = {
          center: { lat: -34.397, lng: 150.644 }, 
          zoom: 8,
        };
        this.map = new google.maps.Map(mapDiv, mapOptions);

        
        this.getCurrentLocation();

        
        this.map.addListener('click', (event: any) => {
          this.handleMapClick(event.latLng);
        });
      } else {
        console.error('El elemento del mapa no se encontró.');
      }
    }, 500); 
  }

  
  handleMapClick(latLng: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        this.direccion = results[0].formatted_address; 
        this.currentLocation = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        console.log('Dirección seleccionada:', this.direccion);
        console.log('Latitud:', this.currentLocation.lat);
        console.log('Longitud:', this.currentLocation.lng);
        
        this.updateMapLocation(); 

        
        if (this.marker) {
          this.marker.setMap(null); 
        }

        
        this.marker = new google.maps.Marker({
          position: this.currentLocation,
          map: this.map,
          title: 'Ubicación seleccionada',
        });
      } else {
        console.error('No se pudo encontrar la dirección:', status);
      }
    });
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Ubicación actual:', this.currentLocation);
          this.updateMapLocation(); 
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  }

  updateMapLocation() {
    if (this.map && this.currentLocation) {
      this.map.setCenter(this.currentLocation); 
      new google.maps.Marker({
        position: this.currentLocation,
        map: this.map,
        title: 'Tu ubicación actual',
      });
    }
  }

  guardarDireccion() {
    if (this.direccion) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: this.direccion }, (results: { geometry: { location: any; }; }[], status: string) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          this.currentLocation = {
            lat: location.lat(),
            lng: location.lng(),
          };
          console.log('Dirección guardada:', this.direccion);
          console.log('Latitud:', this.currentLocation.lat);
          console.log('Longitud:', this.currentLocation.lng);
          this.updateMapLocation(); 
          this.isMapModalOpen = false; 
        } else {
          console.error('No se pudo encontrar la dirección:', status);
        }
      });
    } else {
      console.error('Por favor, ingresa una direccn.');
    }
  }

  translate(key: string): string {
    if (this.translationService && this.translationService.translate) {
      return this.translationService.translate(key);
    }
    console.warn('Translation service is not available');
    return key;
  }

  
  loadInterests() {
    this.spinnerService.show();  // Mostrar spinner
    this.servicesService.getInterests().subscribe(
      (response) => {
         this.spinnerService.hide(); // Ocultar spinner
        if (response.payload && Array.isArray(response.payload)) {
          this.intereses = response.payload.map((interest: any) => ({
            id: interest.id,
            name: this.translate(interest.interes),  // Traducir el nombre del interés
            selected: false
          }));
        }
      },
      (error) => {
         this.spinnerService.hide(); // Ocultar spinner
        console.error('Error al cargar intereses:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Cambia a true si deseas formato de 12 horas
    };
    const formattedDate = date.toLocaleString('es-ES', options).replace(',', '');
    
    // Formato deseado "YYYY-MM-DD HH:mm:ss"
    const [datePart, timePart] = formattedDate.split(' ');
    const [day, month, year] = datePart.split('/');
    return `${year}-${month}-${day} ${timePart}`; // Retorna en el formato requerido
  }

}
