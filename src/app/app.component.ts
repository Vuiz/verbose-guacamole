import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import * as hopscotch from 'hopscotch';
import 'rxjs/add/operator/filter';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RoutePartsService } from "./services/route-parts/route-parts.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appTitle = 'Osprey UAV';
  pageTitle = '';

  constructor(public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.changePageTitle();
    // Init User Tour
    setTimeout(() => {
      hopscotch.startTour(this.tourSteps());
    }, 2000);
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
      id: 'hello-egret',
      showPrevButton: true,
      onEnd: function() {
        self.snackBar.open('Great! Now let\'s explore Osprey\'s features.', 'close', { duration: 5000 });
      },
      onClose: function() {
        self.snackBar.open('You can access the tour at any time via the sidebar.', 'close', { duration: 3000 });
      },
      steps: [
        {
          title: 'Your Dashboard',
          content: 'Access everything you need',
          target: 'dashboard-topbtn', // Element ID
          placement: 'left',
          xOffset: 0,
          yOffset: 20
        },
        {
          title: 'Front Page',
          content: 'An eye catching free front page.',
          target: 'frontend-btn', // Element ID
          placement: 'bottom',
          xOffset: 20
        }
      ]
    }
  }
  changePageTitle() {
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((routeChange) => {
      var routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length)
        return this.title.setTitle(this.appTitle);
      // Extract title from parts;
      this.pageTitle = routeParts
                      .reverse()
                      .map((part) => part.title )
                      .reduce((partA, partI) => {return `${partA} > ${partI}`});
      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);

    });
  }

}
