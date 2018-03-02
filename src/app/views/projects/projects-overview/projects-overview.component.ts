import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';
import { } from 'googlemaps';
import {} from '@types/googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { ProjectsComponent } from '../projects.component';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

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

@Component({
  selector: 'app-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css']
})
export class ProjectsOverviewComponent implements OnInit {
  activityData = [{
    month: 'January',
    spent: 240,
    opened: 8,
    closed: 30
  }, {
    month: 'February',
    spent: 140,
    opened: 6,
    closed: 20
  }, {
    month: 'March',
    spent: 220,
    opened: 10,
    closed: 20
  }, {
    month: 'April',
    spent: 440,
    opened: 40,
    closed: 60
  }, {
    month: 'May',
    spent: 340,
    opened: 40,
    closed: 60
  }];

  tasks = [{
    text: 'Lorem, ipsum dolor sit amet',
    status: 0
  }, {
    text: 'Lorem, ipsum dolor sit amet',
    status: 0
  }, {
    text: 'Lorem, ipsum dolor sit amet',
    status: 1
  }, {
    text: 'Lorem, ipsum dolor sit amet',
    status: 1
  }, {
    text: 'Lorem, ipsum dolor sit amet',
    status: 1
  }]

  tickets = [{
    img: 'assets/images/face-1.jpg',
    name: 'Mike Dake',
    text: 'Excerpt pipe is used.',
    date: new Date('07/12/2017'),
    isOpen: true
  }, {
    img: 'assets/images/face-5.jpg',
    name: 'Jhone Doe',
    text: 'My dashboard is not working.',
    date: new Date('07/7/2017'),
    isOpen: false
  }, {
    img: 'assets/images/face-3.jpg',
    name: 'Jhonson lee',
    text: 'Fix stock issue',
    date: new Date('04/10/2017'),
    isOpen: false
  }, {
    img: 'assets/images/face-4.jpg',
    name: 'Mikie Jyni',
    text: 'Renew my subscription.',
    date: new Date('07/7/2017'),
    isOpen: false
  }, {
    img: 'assets/images/face-5.jpg',
    name: 'Jhone Dake',
    text: 'Payment confirmation.',
    date: new Date('04/10/2017'),
    isOpen: false
  }]

  photos = [{
    name: 'Photo 1',
    url: 'assets/images/sq-15.jpg'
  }, {
    name: 'Photo 2',
    url: 'assets/images/sq-8.jpg'
  }, {
    name: 'Photo 3',
    url: 'assets/images/sq-9.jpg'
  }, {
    name: 'Photo 4',
    url: 'assets/images/sq-10.jpg'
  }, {
    name: 'Photo 5',
    url: 'assets/images/sq-11.jpg'
  }, {
    name: 'Photo 6',
    url: 'assets/images/sq-12.jpg'
  }]
  routeData: any;
  @Input() currentUserUid: string;
  @Input() projectId: string;
  //Define currentProject
  public currentProjectDoc: AngularFirestoreDocument<Project>;
  public currentProject$: Observable<Project>;
  public currentProjectFlights$: Observable<Flight[]>;
  public currentProjectEvents$: Observable<Event[]>;

  //Define currentFlights
  public zoom: number;
  public currentFlightsCol: AngularFirestoreCollection<Flight>;
  public currentFlights$: Observable<Flight[]>;
  constructor(private mapsAPILoader: MapsAPILoader, private router: ActivatedRoute, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
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

    this.currentProjectEvents$ = this.afs.collection<Event>(`/events`, ref => ref.where(`project_id`, "==", this.projectId))
      .valueChanges();
    this.zoom = 13;
    setTimeout(() => this.initiateGoogleAutocomplete(), 2000);
    setTimeout(() => this.initiateGoogleAutocomplete(), 4000);
  }

  private initiateGoogleAutocomplete() {
    //set current position
    //this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
    });
  }
}
