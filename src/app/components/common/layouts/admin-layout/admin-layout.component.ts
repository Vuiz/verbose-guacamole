import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ResolveStart,
  ResolveEnd
} from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { MatSidenav } from '@angular/material';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { ThemeService } from '../../../../services/theme/theme.service';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import * as Ps from 'perfect-scrollbar';
import * as domHelper from '../../../../helpers/dom.helper';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { CoreAuthService } from '../../../../core-auth.service';
interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html'
})
export class AdminLayoutComponent implements OnInit {
  private isMobile;
  isSidenavOpen: Boolean = false;
  isModuleLoading: Boolean = false;
  moduleLoaderSub: Subscription;
  @ViewChild(MatSidenav) private sideNave: MatSidenav;

    usersCol: AngularFirestoreCollection<User>;
    user: Observable<User[]>;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    public translate: TranslateService,
    private afs: AngularFirestore,
    public themeService: ThemeService
  ) {
    //users$.subscribe(console.log);
    //usersList.push({ name: 'new item' }); // must adhere to type Item
    //this.userCollectionRef = this.afs.collection<User>('users');
    //this.user$ = this.userCollectionRef.valueChanges();
    // Close sidenav after route change in mobile
    router.events.filter(event => event instanceof NavigationEnd)
    .subscribe((routeChange: NavigationEnd) => {
      if(this.isNavOver()) {
        this.sideNave.close()
      }
    });

    // Translator init
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit() {
    //Bind user using valueChanges
    this.usersCol = this.afs.collection('users');
    this.user = this.usersCol.valueChanges();
    // Initialize Perfect scrollbar for sidenav
    let navigationHold = document.getElementById('scroll-area');
    Ps.initialize(navigationHold, {
      suppressScrollX: true
    });

    // FOR MODULE LOADER FLAG
    this.moduleLoaderSub = this.router.events.subscribe(event => {
      if(event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.isModuleLoading = true;
      }
      if(event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
    });
  }
  ngOnDestroy() {
    this.moduleLoaderSub.unsubscribe();
  }
  isNavOver() {
    let isSm = window.matchMedia(`(max-width: 960px)`).matches;

    // Disable collapsed menu in small screen
    if(isSm && domHelper.hasClass(document.body, 'collapsed-menu')) {
      domHelper.removeClass(document.body, 'collapsed-menu')
    }
    return isSm;
  }
  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/sessions/signin']);
  }
}
