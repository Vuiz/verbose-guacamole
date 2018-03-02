import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Subscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { } from 'googlemaps';
import {} from '@types/googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';

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

//Define User array

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

//Define Service array

interface Service {
  ref_name: string;
  advanced_edit: boolean;
  basic_edit: boolean;
  mat_icon: string;
  progress: number;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  activeView : string = 'overview';

  public latitude: number = 0.0;
  public longitude: number = 0.0;
  public zoom: number;
  public projectId: string;
  public currentUserUid: string;

  // Doughnut
  doughnutChartColors: any[] = [{
    backgroundColor: ['#fff', 'rgba(0, 0, 0, .24)',]
  }];

  total1: number = 500;
  data1: number = 200;
  doughnutChartData1: number[] = [this.data1, (this.total1 - this.data1)];

  total2: number = 1000;
  data2: number = 400;
  doughnutChartData2: number[] = [this.data2, (this.total2 - this.data2)];

  doughnutChartType = 'doughnut';
  doughnutOptions: any = {
    cutoutPercentage: 85,
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false,
      position: 'bottom'
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    },
    tooltips: {
      enabled: false
    }
  };

  //Define userProjects
  public userProjectsCol: AngularFirestoreCollection<Project>;
  public userProjects: Observable<Project[]>;

  //Define currentProject
  public currentProjectDoc: AngularFirestoreDocument<Project>;
  public currentProject$: Observable<Project>;
  public currentProjectFlights$: Observable<Flight[]>;

  //Define currentFlights
  public currentFlightsCol: AngularFirestoreCollection<Flight>;
  public currentFlights$: Observable<Flight[]>;
  //Define services -- not used atm --
  servicesCol: AngularFirestoreCollection<Service>;
  services: Observable<Service[]>;

  circleMapRadius = 500;
  circleMapCenter = { lat: 0, lng: 0 };
  constructor(private mapsAPILoader: MapsAPILoader, private router: ActivatedRoute, private afAuth: AngularFireAuth, private afs: AngularFirestore, private titleService: Title, private db: FirestoreService) { }

  ngOnInit() {
      this.projectId = this.router.snapshot.paramMap.get('id');
      //this.titleService.setTitle('Projects > ' + this.projectId )

          this.afAuth.authState.subscribe(res => {
            if (res && res.uid) {
              this.currentUserUid = res.uid;
              //console.log(this.currentUser.uid);
            }

            this.projectId = this.router.snapshot.paramMap.get('id');
            console.log('user uid: ' + this.currentUserUid, 'project uid: ' + this.projectId);

            //Bind projects using valueChanges

             this.currentProject$ = this.afs.doc<Project>(`projects/${this.projectId}`)
              .valueChanges();

             //Bind currentProject using valueChanges
             this.currentProjectFlights$ = this.afs.doc<Project[]>(`projects/${this.projectId}`)
             .valueChanges()
             .switchMap( flights =>
               this.afs.collection<Flight>(`/flights`, ref => ref.where('project_id', '==', this.projectId)).valueChanges()
             );


            /*this.currentProjectFlights$.subscribe(post => {
              console.log('post', post);
            });
            this.currentProject$.subscribe(pop => {
              console.log('pp', pop);
            });

           /*this.currentProject.subscribe(post => {
              console.log('post', post);
            });*/

          /*  this.currentFlightsCol = this.afs.collection('users/' + this.currentUserUid + '/projects/' + this.projectId + '/flights');
            this.currentFlights = this.currentFlightsCol.valueChanges();
            //this.currentFlights = this.db.col$(this.currentFlightsCol);
            this.currentFlights.subscribe(sum => {
              console.log(sum);
            });

        //  });


            /*Bind currentProject using valueChanges
            this.currentProjectDoc = this.afs.doc('users/' + this.currentUserUid + '/projects/' + this.projectId);
            this.currentProject = this.currentProjectDoc.valueChanges();*/
          /*  this.currentFlights.subscribe(
              //err => console.log('err = '+JSON.stringify(err, null, 2)), // <---
              ref => {
              if (ref) {
                console.log(ref.geo);
                this.currentFlights.map(data => {
                  //this.currentFlightsCol = this.afs.collection('users/' + this.currentUserUid + '/projects/' + this.projectId + '/flights');
                  //this.currentFlights = this.currentFlightsCol.valueChanges();
                  //this.currentFlights.map(function(doc){
                    //data.flights = doc.data();
                  //});
                  this.latitudeString = ref.geo.latitude.toString();
                  this.longitudeString = ref.geo.longitude.toString();
                  data.latitude = parseFloat(this.latitudeString);
                  data.longitude = parseFloat(this.longitudeString);
                });
              }
            });

            /*this.currentProject.switchMap(data => {
              data.id = this.projectId;
            });
            this.currentProject.subscribe(cpr => {
              console.log(cpr);
            });*/
            //Bind services using valueChanges
            this.servicesCol = this.afs.collection('services');
            this.services = this.servicesCol.valueChanges();

          });

          this.zoom = 13;
          setTimeout(() => this.initiateGoogleAutocomplete(), 2000);
          setTimeout(() => this.initiateGoogleAutocomplete(), 4000);
        }

        private initiateGoogleAutocomplete(){
          //set current position
          //this.setCurrentPosition();

          //load Places Autocomplete
          this.mapsAPILoader.load().then(() => {
          });
  }
}
