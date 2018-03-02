import { Component, ElementRef, NgZone, NgModule, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as domHelper from '../../helpers/dom.helper';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OrderModule } from 'ngx-order-pipe';
import 'rxjs/add/operator/switchMap';
import { CoreAuthService } from '../../core-auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { EventPipe } from '../../pipes/common/event.pipe';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { } from 'googlemaps';
import {} from '@types/googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { NgxCarousel } from 'ngx-carousel';
import * as hopscotch from 'hopscotch';
import { Router, ActivatedRoute } from '@angular/router';
import { map, take, debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
  type CollectionPredicate<T>   = string |  AngularFirestoreCollection<T>;
  type DocPredicate<T> = string |  AngularFirestoreDocument<T>;
// Define Project array

interface newProject {
    location_ref: string;
    circleLat: number;
    circleLon: number;
    stage: number;
    geo?: firebase.firestore.GeoPoint;
  }

// Define Project array

interface Project {
    id: string;
    ref_name: string;
    label: string;
    stage: string;
    progress: number;
    next_event_ref_path: string;
    date: Date;
  }

// Define Flight array
interface Flight {
  id: string;
  name?: string;
  label?: string;
  address?: string;
  takeoff?: Date;
  geo: firebase.firestore.GeoPoint;
}

// Define initData array
interface initData {
  takeoff: Date;
  geo: any;
}

// Define Event array

interface Event {
  ref_name: string;
  creation_date: Date;
  from: Date;
  til: Date;
  progress_at_completion: number;
}

// Define Tour array

interface Tour {
  user_uid: string;
  id: string;
  dash_intro: boolean;
}

// Define User array

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  tours?: Tour;
}

// Define Service array

interface Service {
  ref_name: string;
  advanced_edit: boolean;
  basic_edit: boolean;
  mat_icon: string;
  progress: number;
}

// Define Center array

interface Center {
  id?: string;
  geo?: firebase.firestore.GeoPoint;
}
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
  public carousel: NgxCarousel[];

  public latitude: number[];
  public longitude: number[];
  public latitudeString: string;
  public longitudeString: string;
  public searchControl: FormControl;
  public zoom: number;
  public mapTypeControl: any;
  public placeName: string[];
  public address: string[];
  public circleLatitude: number[];
  public circleLongitude: number[];
  public serviceSelect: any;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  // Define hover inputs for transitioning cards
  @Input() div: string;
  @Input() project: CollectionPredicate<any>;

  // Define dbUser
  public toursCol: AngularFirestoreCollection<Tour>;
  public tours: Observable<Tour[]>;

  // Define userProjects
  public newProjectCol: AngularFirestoreDocument<newProject>;
  public newProject$: Observable<newProject>;

  // Define hoverTimeline
  // public hoverTimelineCol: AngularFirestoreCollection<Event>;
  // public hoverTimeline: Observable<Event[]>;

  // Define userProjects
  public userProjectsCol: AngularFirestoreCollection<Project>;
  public userProjects$: Observable<Project[]>;

  public projectCheck: boolean;
  // Define user
  user$: Observable<User | null>;
  currentUser: User;

  // Define currentFlights
  public newProjectFlightsCol: AngularFirestoreCollection<Flight>;
  public newProjectFlights$: Observable<Flight[]>;

  // Define projectEvents
  projectEventsCol: AngularFirestoreCollection<Event>;
  projectEvents: Observable<Event[]>;

  // Define services -- not used atm --
  servicesCol: AngularFirestoreCollection<Service>;
  services: Observable<Service[]>;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  flightsFormGroup: FormGroup;
  searchControlArray: FormArray;
  currentUserUid: string;
  flightInitData: Flight[];
  manualRepositioning: number;
  public circleData: Center = {};

  circleMapRadius = 500;
  circleMapCenter = { lat: 0, lng: 0 };

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private fb: FormBuilder, private afs: AngularFirestore,
     public snackBar: MatSnackBar, private afAuth: AngularFireAuth, private auth: CoreAuthService, private db: FirestoreService,
     private router: Router) {}
  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      label: ['', Validators.required],
      serviceSelect: ['', Validators.required],
      date: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });

    this.flightsFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });

    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('user "' + res.uid + '" is logged in');
      this.currentUserUid = res.uid;

    // Bind projects using valueChanges
    this.userProjectsCol = this.afs.collection('/projects', ref => ref.where('master_user', '==', this.currentUserUid));
    this.userProjects$ = this.db.colWithIds$(this.userProjectsCol);

    this.userProjects$.subscribe(rea => {
      if (rea) {
        this.projectCheck = true;
      } else {
        this.projectCheck = false;
      }
    });


    // Bind newProject$ using valueChanges
    this.newProjectCol = this.afs.doc('users/' + res.uid + '/newProject$/new/');
    this.newProject$ = this.newProjectCol.valueChanges();
    this.newProject$.subscribe(rea => {
      // If new Project does not exist
      if (!rea) {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitudeString = position.coords.latitude.toString();
            this.longitudeString = position.coords.longitude.toString();
            const initData = { geo: this.db.geopoint(parseFloat(this.latitudeString), parseFloat(this.longitudeString)), new: true };
            this.db.set('/users/' + res.uid + '/newProject$/new', initData);
            const flightInitData = { geo: this.db.geopoint(parseFloat(this.latitudeString),
              parseFloat(this.longitudeString)), new: true, id: '' };
            this.zoom = 14;
            flightInitData.id = this.afs.createId();
            this.db.set('/users/' + res.uid + '/newFlights/' + flightInitData.id, flightInitData);
          });
        }
        // set current position
        this.setCurrentPosition();
      }
    });
      this.newProjectFlights$ = this.afs.collection<Flight>(`/users/` + res.uid + `/newFlights`)
        .valueChanges();
      this.newProjectFlights$.subscribe(ree => {
        // If new project flight does not exist
        if (!ree) {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
              this.latitudeString = position.coords.latitude.toString();
              this.longitudeString = position.coords.longitude.toString();
              const flightInitData = { geo: this.db.geopoint(parseFloat(this.latitudeString),
                parseFloat(this.longitudeString)), new: true, id: '' };
              console.log(flightInitData);
              this.zoom = 14;
              flightInitData.id = this.afs.createId();
              this.circleData[flightInitData.id].add({ geo: this.db.geopoint(parseFloat(this.latitudeString),
                parseFloat(this.longitudeString)) });
              this.db.set('/users/' + res.uid + '/newFlights/' + flightInitData.id, flightInitData);
            });
          }
        } else {
          ree.forEach(a => {
            this.circleData[a.id] = { id: a.id, geo: this.db.geopoint(a.geo.latitude, a.geo.longitude)};
          });
        }
    });


    // UNCOMMENT WHEN CONTINUING WITH TOURS
    /*Bind tours using valueChanges
    this.tours = this.afs.collection<Tour>('tours/', ref => ref.where(`user_uid`, `==`, this.currentUserUid)).valueChanges();
      this.tours.subscribe(ree => {
        ree.forEach(i => {
          console.log(i.id, ree[0])
          if (ree[0].dash_intro == undefined || false) {
            // Destroy running tour
            hopscotch.endTour(true);
            // Initialize new tour
            hopscotch.startTour(this.tourSteps());
          }
        });
      });*/

    // Bind services using valueChanges
    this.servicesCol = this.afs.collection('services');
    this.services = this.servicesCol.valueChanges();


  } else {
    console.log('user not logged in');
    this.router.navigate(['./sessions/signin']);
  }
  });
    // set google maps defaults
    this.zoom = 13;
    setTimeout(() => this.initiateGoogleAutocomplete(), 2000);
    setTimeout(() => this.initiateGoogleAutocomplete(), 4000);
    this.manualRepositioning = 0;
  }

private initiateGoogleAutocomplete(){
  // load Places Autocomplete
  var acInputs = document.getElementsByClassName(`autocomplete`);
  var acDb = this.afs.collection<Flight>(`/users/` + this.currentUserUid + `/newFlights`).valueChanges();
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

            // verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            /**/
            // set latitude, longitude and zoom with the id of the map as an array key
            const data = { id: i.id, name: place.name, address: place.formatted_address,
              geo: this.db.geopoint(place.geometry.location.lat(), place.geometry.location.lng()) };

            this.circleData[i.id] = { geo: this.db.geopoint(place.geometry.location.lat(), place.geometry.location.lng()) };
            console.log(data);
            this.mapTypeControl = true;
            this.db.upsert(`/users/` + this.currentUserUid + `/newFlights/` + i.id, data);
          });
        });
      });
    });
  });
}

  private setCurrentPosition() {
    var acDb = this.afs.collection<Flight>(`/users/` + this.currentUserUid + `/newFlights`).valueChanges();
    var acDbId = acDb.subscribe(ref => {

      ref.forEach(i => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude[i.id] = position.coords.latitude;
            this.longitude[i.id] = position.coords.longitude;
            this.zoom = 14;
          });
        }
      })
    })
  }

  stepOneNext(){
    console.log(this.firstFormGroup.status);
    if (this.firstFormGroup.status === 'VALID') {
      /*var acDb = this.afs.collection<Flight>(`/users/` + this.currentUserUid + `/newFlights`).valueChanges();
      acDb.subscribe(ref => {

        ref.forEach(i => {
          const data = { id: i.id, geo: i.geo, label: i.name}
          this.db.upsert('/users/' + this.currentUserUid + '/newFlights/' + data.id,  data);
        });
      });*/
    }
  }
  stepTwoNext(){
    console.log(this.secondFormGroup.status);
    if(this.secondFormGroup.status === 'VALID'){
      const data = this.firstFormGroup.value
      data.master_user = this.currentUserUid;
      data.new = false;
      data.stage = 'awaiting_approval';
      data.progress = 5;
      data.id = this.afs.createId();

      var stepTwoFlightsDb = this.afs.collection<Flight>(`/users/` + this.currentUserUid + `/newFlights`).valueChanges();
      var stepTwoFlights = stepTwoFlightsDb.subscribe(ref => {

        ref.forEach(i => {
          const flightInitData = { name: i.name, master_user: this.currentUserUid, address: i.address, geo: i.geo,
            id: this.afs.createId(), project_id: data.id};
          console.log(flightInitData);
          this.db.upsert('/flights/' + flightInitData.id, flightInitData);
          if (data.geo === undefined) { data.geo = i.geo; }
          this.db.set('/projects/' + data.id, data);
        })
      })
    }
  }


  addFlight() {
    // If new project flight does not exist
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitudeString = position.coords.latitude.toString();
        this.longitudeString = position.coords.longitude.toString();
        const flightInitData = { geo: this.db.geopoint(parseFloat(this.latitudeString),
          parseFloat(this.longitudeString)), new: true, id: '' };
        console.log(flightInitData);
        this.zoom = 14;
        flightInitData.id = this.afs.createId();
        this.circleData[flightInitData.id] = { geo: this.db.geopoint(parseFloat(this.latitudeString), parseFloat(this.longitudeString)) };
        this.db.set('/users/' + this.currentUserUid + '/newFlights/' + flightInitData.id, flightInitData);
      });
    }
    this.initiateGoogleAutocomplete();
    }

    circleMapRadiusChange(radius) {
      this.circleMapRadius = radius;
      // console.log(e)
    }
  circleMapCenterChange(center, id) {
      this.circleData[id] = { geo: this.db.geopoint(center.lat, center.lng)};
  }
    public selectorChange(center) {
        const data = this.firstFormGroup.value;
        this.serviceSelect = data.serviceSelect;
  }

  ngOnDestroy() {
    hopscotch.endTour(true);
  }

  /*
  ***** Tour Steps ****
  * You can supply tourSteps directly in hopscotch.startTour instead of
  * returning value by invoking tourSteps method,
  * but DOM query methods(querySelector, getElementsByTagName etc) will not work
  */
  tourSteps(): any {
    let self = this;
    return {
      id: 'demo-tour',
      showPrevButton: true,
      onEnd: function() {
        self.snackBar.open('User tour ended!', 'close', { duration: 3000 });
      },
      onClose: function() {
        self.snackBar.open('You just closed User Tour!', 'close', { duration: 3000 });
      },
      steps: [
        {
          "title": "A few Welcome messages",
          "content": "Thanks for showing your interest. You can start your order here, on your dashboard. Once you've submitted a project, it will appear here also.",
          "target": "d_i_stepOne",
          "placement": "right",
          "xOffset": -1000
        },
        {
          "title": "Step Two",
          "content": "This is step description.",
          "target": "areaTwo",
          "placement": "left",
          "xOffset": 15
        }
      ]
    }
  }
  startTour() {
    // Destroy running tour
    hopscotch.endTour(true);
    // Initialize new tour
    hopscotch.startTour(this.tourSteps());
  }


}
