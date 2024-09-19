import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { environment } from '../../environments/environment'; // Asegúrate de que la ruta sea correcta
// Agregar la importación de Google Maps
declare const google: any; // Declarar la variable google

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {
  // Propiedades para el formulario
  titulo: string = '';
  descripcion: string = '';
  fecha: string = '';
  costo: number | null = null; // Puede ser null si no se ha ingresado
  tipo: string = '';
  tema: string = '';
  rangeValues: { lower: number; upper: number } = { lower: 18, upper: 60 }; // Valores iniciales
  lowerValue: number = this.rangeValues.lower; // Valor inferior
  upperValue: number = this.rangeValues.upper; // Valor superior
  direccion: string = ''; // Nueva propiedad para la dirección
  isMapModalOpen: boolean = false; // Controla la visibilidad del modal del mapa
  imagen: string | null = null; // Nueva propiedad para almacenar la imagen
  map: any;
  currentLocation: { lat: number; lng: number } | null = null; // Para almacenar la ubicación actual
  sugerencias: any[] = [];
  marker: any; // Nueva propiedad para almacenar el marcador

  constructor() { 
    // Asignar initMap al objeto window
    (window as any).initMap = this.initMap.bind(this);
  }

  ngOnInit() {
  }

  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  // Método para seleccionar una sugerencia
  seleccionarSugerencia(sugerencia: any) {
    this.direccion = sugerencia.description; // Establece la dirección seleccionada
    this.sugerencias = []; // Limpia las sugerencias
    this.updateMapLocationFromAddress(this.direccion); // Actualiza el mapa con la dirección seleccionada
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
            this.updateMapLocation(); // Actualiza el mapa con la nueva ubicación
        } else {
            console.error('No se pudo encontrar la dirección:', status);
        }
    });
  }

  // Método para actualizar los valores del rango
  updateValues() {
    this.lowerValue = this.rangeValues.lower; // Actualiza el valor inferior
    this.upperValue = this.rangeValues.upper; // Actualiza el valor superior
  }

  buscarDireccion() {
    if (this.direccion) {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: this.direccion }, (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.sugerencias = predictions; // Almacena las sugerencias
        } else {
          this.sugerencias = []; // Limpia las sugerencias si hay un error
        }
      });
    } else {
      this.sugerencias = []; // Limpia las sugerencias si el campo está vacío
    }
  }
  
  // Método para manejar el envío del formulario
  onSubmit() {
    // Aquí puedes manejar la lógica para registrar la reunión
    const meetingData = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      fecha: this.fecha,
      costo: this.costo,
      tipo: this.tipo,
      tema: this.tema,
      edad: this.rangeValues,
      direccion: this.direccion, // Agregar dirección a los datos
    };

    console.log('Datos de la reunión:', meetingData);
    // Aquí puedes agregar la lógica para enviar los datos a un servicio o API
  }

  selectedDate: string = new Date().toISOString(); // Fecha inicial
  isDatePickerVisible: boolean = false;

  showDatePicker() {
    console.log('showDatePicker');
    this.isDatePickerVisible = !this.isDatePickerVisible; // Alternar visibilidad
    console.log('showDatePicker', this.isDatePickerVisible); // Verifica el estado
  }
  
  onDateChange(event: any) {
    this.selectedDate = event.detail.value; // Actualizar la fecha seleccionada
    this.isDatePickerVisible = false; // Ocultar el date picker después de seleccionar
  }

  // Método para mostrar el modal del mapa
  showMapModal() {
    this.loadGoogleMaps();
    this.isMapModalOpen = true; // Abre el modal
  }

  // Método para obtener coordenadas (implementa la lógica según tu API)
  obtenerCoordenadas() {
    // Aquí puedes implementar la lógica para obtener las coordenadas
    console.log('Obteniendo coordenadas...');
    // Actualiza la dirección y cierra el modal
    this.direccion = 'Dirección seleccionada'; // Cambia esto según la lógica de tu API
    this.isMapModalOpen = false; // Cerrar el modal
  }

  // Método para abrir la galería o la cámara
  async subirImagen() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl, // Obtiene la imagen como Data URL
    });

    this.imagen = image.dataUrl ?? null; // Almacena la imagen en la propiedad, asegurándose de que sea null si es undefined
    console.log('Imagen seleccionada:', this.imagen);
  }

  onMapModalDidPresent() {
    console.log('Modal presentado, cargando Google Maps...');
    this.loadGoogleMaps(); // Carga el script de Google Maps cuando el modal se presenta
    this.getCurrentLocation(); // Obtiene la ubicación actual al abrir el modal
  }
  // Método para inicializar el mapa
  initMap() {
    console.log('initMap llamado');
    setTimeout(() => {
      const mapDiv = document.getElementById('map');
      console.log('mapDiv:', mapDiv); // Verifica si el elemento se encuentra
      if (mapDiv) {
        const mapOptions = {
          center: { lat: -34.397, lng: 150.644 }, // Coordenadas por defecto
          zoom: 8,
        };
        this.map = new google.maps.Map(mapDiv, mapOptions);

        // Obtener la ubicación actual del usuario
        this.getCurrentLocation();

        // Agregar evento de clic al mapa
        this.map.addListener('click', (event: any) => {
          this.handleMapClick(event.latLng);
        });
      } else {
        console.error('El elemento del mapa no se encontró.');
      }
    }, 500); // Aumenta el tiempo si es necesario
  }

  // Método para manejar el clic en el mapa
  handleMapClick(latLng: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        this.direccion = results[0].formatted_address; // Establece la dirección obtenida
        this.currentLocation = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        console.log('Dirección seleccionada:', this.direccion);
        console.log('Latitud:', this.currentLocation.lat);
        console.log('Longitud:', this.currentLocation.lng);
        
        this.updateMapLocation(); // Actualiza el mapa con la nueva ubicación

        // Eliminar el marcador anterior si existe
        if (this.marker) {
          this.marker.setMap(null); // Elimina el marcador del mapa
        }

        // Agregar un nuevo marcador
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
          this.updateMapLocation(); // Actualiza el mapa con la ubicación actual
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
      this.map.setCenter(this.currentLocation); // Centra el mapa en la ubicación actual
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
          this.updateMapLocation(); // Actualiza el mapa con la nueva ubicación
          this.isMapModalOpen = false; // Cierra el modal después de guardar
        } else {
          console.error('No se pudo encontrar la dirección:', status);
        }
      });
    } else {
      console.error('Por favor, ingresa una dirección.');
    }
  }

}

