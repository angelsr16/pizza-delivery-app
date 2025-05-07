import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { DeliveryLocation } from '../../../core/models/db/DeliveryLocation';

@Component({
  selector: 'app-delivery-map',
  imports: [],
  templateUrl: './delivery-map.component.html',
  styleUrl: './delivery-map.component.scss',
})
export class DeliveryMapComponent {
  @Input() deliveryLocation!: DeliveryLocation;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private marker!: L.Marker;

  ngAfterViewInit(): void {
    console.log(this.deliveryLocation);
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.deliveryLocation.lat, this.deliveryLocation.lng],
      15
    ); // Default center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    delete (L.Icon.Default.prototype as any)._getIconUrl;

    const iconDefault = L.icon({
      iconUrl: 'assets/icons/marker_icon.png',
      shadowUrl: 'assets/icons/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.marker = L.marker(
      [this.deliveryLocation.lat, this.deliveryLocation.lng],
      {
        draggable: true,
        icon: iconDefault,
      }
    ).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      console.log('New position:', position.lat, position.lng);
      this.deliveryLocation.lat = position.lat;
      this.deliveryLocation.lng = position.lng;
    });
  }

  ngOnDestroy(): void {
    this.map.remove();
  }
}
