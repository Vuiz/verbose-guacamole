import { Component, OnInit, NgZone } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { } from 'googlemaps';
import { } from '@types/googlemaps';
import { AgmCoreModule, MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { MatTabChangeEvent } from '@angular/material';
import { isUndefined } from 'util';
import { Subject } from 'rxjs';

//Define Project array
interface Project {
  id: string;
  ref_name: string;
  stage: string;
  progress: number;
  next_event_ref_path: string;
  flights: Flight[];
  date: Date;
}

//Define Flight array
interface Flight {
  id: string;
  takeoff: Date;
  geo?: firebase.firestore.GeoPoint;
}

//Define Project Event array
interface Event {
  flightEvent?: boolean;
  type?: string;
  geo?: firebase.firestore.GeoPoint;
  timeAt: Date;
  timeEnd?: Date;
}

// Define Center array
interface Center {
  id?: string;
  geo?: firebase.firestore.GeoPoint;
}
@Component({
  selector: 'app-projects-settings',
  templateUrl: './projects-settings.component.html',
  styleUrls: ['./projects-settings.component.css']
})
export class ProjectsSettingsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  public hasBaseDropZoneOver: boolean = false;
  public projectId: string;
  public currentUserUid: string;
  //Define currentProject
  public currentProjectDoc: AngularFirestoreDocument<Project>;
  public currentProject$: Observable<Project>;
  public currentProjectFlights$: Observable<Flight[]>;
  public currentProjectEvents$: Observable<Event[]>;

  private mapLoadedSubject: Subject<boolean> = new Subject<boolean>();
  //Define currentFlights
  public zoom: number = 13;
  public circleData: Center = {};
  public currentFlightsCol: AngularFirestoreCollection<Flight>;
  public currentFlights$: Observable<Flight[]>;
  constructor(private gmaps: GoogleMapsAPIWrapper, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private router: ActivatedRoute, private afAuth: AngularFireAuth, private afs: AngularFirestore, private db: FirestoreService) {
  }

  ngOnInit() {
    this.projectId = this.router.snapshot.parent.paramMap.get('id');

    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.currentUserUid = res.uid;
      }
    });

    this.currentProject$ = this.afs.doc<Project>(`projects/${this.projectId}`)
      .valueChanges();

    //Bind currentProject using valueChanges
    this.currentProjectFlights$ = this.afs.doc<Project[]>(`projects/${this.projectId}`)
      .valueChanges()
      .switchMap(flights =>
        this.afs.collection<Flight>(`/flights`, ref => ref.where('project_id', '==', this.projectId)).valueChanges()
      );

    this.currentProjectEvents$ = this.afs.collection<Event>(`/events`, ref => ref.where(`project_id`, '==', this.projectId))
      .valueChanges();

    this.currentProjectFlights$.subscribe(ree => {{
        ree.forEach(a => {
          this.circleData[a.id] = { id: a.id, geo: this.db.geopoint(a.geo.latitude, a.geo.longitude) };
        });
      }
    });

    this.zoom = 13;

    //setTimeout(() => this.initiateGoogleAutocomplete(), 2000);
    //setTimeout(() => this.initiateGoogleAutocomplete(), 4000);
  }

  private initiateGoogleAutocomplete() {
    // load Places Autocomplete
    var acInputs = document.getElementsByClassName(`autocomplete`);
    var acDb = this.afs.collection<Flight>(`/flights`, ref => ref.where(`project_id`, "==", this.projectId)).valueChanges();
    acDb.subscribe(ref => {

      ref.forEach(i => {
        this.mapsAPILoader.load().then(() => {
          let autocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>acInputs[i.id], {
            types: []
          });
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              // get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              this.mapLoadedSubject.subscribe(res => {
              while(res == true){
              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }


              // set latitude, longitude and zoom with the id of the map as an array key
              const data = {
                id: i.id, name: place.name, address: place.formatted_address,
                geo: this.db.geopoint(place.geometry.location.lat(), place.geometry.location.lng())
              };

              this.circleData[i.id] = { geo: this.db.geopoint(place.geometry.location.lat(), place.geometry.location.lng()) };
              console.log(data);
            }});
            });
          });
        });
      });
    });
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  public onMapReady(map){
    console.log(map);
    google.maps.event.trigger(map, 'resize');
  }
  public loadMap(event) {
    this.mapsAPILoader.load().then(() => {
    const acInputs = document.getElementsByClassName(`autocomplete`);
    const maps = document.getElementsByClassName(`agm-map-a`);
    const id = <string>event.tab._viewContainerRef._data.componentView.parent.oldValues[0];
      this.gmaps.getNativeMap().then(map => {
          google.maps.event.trigger(map, 'resize');
      }).catch(e => console.log(e));
      console.log(id);
      let autocomplete = new google.maps.places.Autocomplete(<HTMLInputElement>acInputs[id], {
        types: []
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          /**/
          // set latitude, longitude and zoom with the id of the map as an array key
          const data = {
            id: id, name: place.name, address: place.formatted_address,
            geo: this.db.geopoint(place.geometry.location.lat(), place.geometry.location.lng())
          };

          this.circleData[id] = { geo: this.db.geopoint(place.geometry.location.lat(), place.geometry.location.lng()) };
          console.log(data);
        })
      });
    });
  }

  public changeZoom(){
    this.zoom = 14;
    setTimeout(() => this.initiateGoogleAutocomplete(), 200);
    this.zoom = 13;
  }

  ngAfterViewInit() {
        // This callback will return when the google maps component
        // is finished loading. At this point, the declared "google"
        // variable will contain an object reference, making functions
        // needed by onFitContents available for use.
        this.mapsAPILoader.load().then(() => {
          this.mapLoadedSubject.next(true);
          this.mapLoadedSubject.complete();
        });
    }
}
