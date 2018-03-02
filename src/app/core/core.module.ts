import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { CoreAuthService } from '../core-auth.service';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    CommonModule
  ],
  declarations: [],
  providers: [CoreAuthService]
})
export class CoreModule { }
