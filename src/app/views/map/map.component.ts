import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  zoom = 15;
  mapCenter = {
    lat: 23.806921,
    lng: 90.377078
  }
  polylinePoints = [
    { lat: 24.847916, lng: 89.369764 },
    { lat: 23.806921, lng: 90.377078 },
    { lat: 24.919298, lng: 91.831699 }
  ];
  circleMapRadius = 500;
  circleMapCenter = { lat: 0, lng: 0 };
  constructor() { }

  ngOnInit() {
  }

  circleMapRadiusChange(radius) {
    this.circleMapRadius = radius;
    // console.log(e)
  }
  circleMapCenterChange(lat, long) {
    this.circleMapCenter = lat, long;
    console.log(this.circleMapCenter);
  }
}
