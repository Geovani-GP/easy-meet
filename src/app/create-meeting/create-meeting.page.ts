import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { environment } from '../../environments/environment'; 
import { TranslationService } from '../services/translation.service';

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

  constructor(private translationService: TranslationService) { 
    
    (window as any).initMap = this.initMap.bind(this);
  }

  ngOnInit() {
    this.loadGoogleMaps();
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
    
    const meetingData = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      fecha: this.fecha,
      costo: this.costo,
      tipo: this.tipo,
      tema: this.tema,
      edad: this.rangeValues,
      direccion: this.direccion, 
    };

    console.log('Datos de la reunión:', meetingData);
    
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
    this.isDatePickerVisible = false; 
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

    this.imagen = image.dataUrl ?? null; 
    console.log('Imagen seleccionada:', this.imagen);
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
      console.error('Por favor, ingresa una dirección.');
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

