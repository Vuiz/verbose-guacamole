import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { rootRouterConfig } from './app.routes';
import { AppCommonModule } from "./components/common/app-common.module";
import { AppComponent } from './app.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { OrderModule } from 'ngx-order-pipe';
import {Observable} from 'rxjs/Observable';
import { RoutePartsService } from './services/route-parts/route-parts.service';
import { NavigationService } from "./services/navigation/navigation.service";
import { AuthGuard } from './services/auth/auth.guard';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { CoreModule } from './core/core.module';
import { CoreAuthService } from './core-auth.service';
import { FirestoreService } from "./services/firestore/firestore.service";
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { PaymentService } from './services/payment/payment.service';
import { PaymentRequestComponent } from './payment-request/payment-request.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    HttpModule,
    CoreModule,
    AppCommonModule,
    PerfectScrollbarModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    Ng4GeoautocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCZ8to-DLfDBLK_YU1mKYHlNPGe00LaLeM",
      libraries: ["places"]
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: false })
  ],
  declarations: [AppComponent, PaymentRequestComponent],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    GoogleMapsAPIWrapper,
    RoutePartsService,
    NavigationService,
    AuthGuard,
    FirestoreService,
    CoreAuthService,
    PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
