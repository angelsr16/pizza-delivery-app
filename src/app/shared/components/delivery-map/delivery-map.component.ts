import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-delivery-map',
  imports: [],
  templateUrl: './delivery-map.component.html',
  styleUrl: './delivery-map.component.scss',
})
export class DeliveryMapComponent {
  private map!: L.Map;
  private marker!: L.Marker;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([40.7128, -74.006], 13); // Default center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([40.7128, -74.006], { draggable: true }).addTo(
      this.map
    );

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      console.log('New position:', position.lat, position.lng);
      // Save this position to your form or state
    });
  }
}
