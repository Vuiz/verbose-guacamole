import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CoreAuthService } from '../../../core-auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';
import { NgZone } from '@angular/core';
interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  user: User;
  toGoogle: boolean;
  toDash: boolean;
  signinForm: FormGroup;

  constructor(private zone: NgZone, public auth: CoreAuthService, public afAuth: AngularFireAuth, private router: Router,
  private afs: AngularFirestore) {
  };

  ngOnInit() {
    this.afAuth.authState.subscribe(res => {
    if(res && res.uid){
      this.toDash = true;
      this.zone.run(() => this.router.navigateByUrl('./dashboard'));
      setTimeout(() => this.progressBar.mode = 'indeterminate', 100);
    } else {
      this.progressBar.mode = "determinate";
    };
  });
    this.signinForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    });
  }
  logout() {
    this.afAuth.auth.signOut();
    this.submitButton.disabled = false;
    setTimeout(() => this.progressBar.mode = 'determinate', 100);
  }
  signin() {
    const signinData = this.signinForm.value
    //console.log(signinData);

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';

    this.auth.emailAndPassLogin(signinData);

    }
  googleLoginClick() {
        this.submitButton.disabled = true;
        this.progressBar.mode = 'indeterminate';
        this.toGoogle = true;
        this.auth.googleLogin();
  }
    /*this.afAuth.auth.signInWithEmailAndPassword(signinData.username, signinData.password)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    this.snackBar.open('Wrong password. Please check the spelling and try again', 'close', { duration: 2000 });
  } else {
    this.snackBar.open(errorMessage, 'close', { duration: 2000 });
    console.log(errorMessage);
  }
  console.log(error);
});
  if(this.user){
  } else {
    this.progressBar.mode = "determinate";
    this.submitButton.disabled = false;
  };*/

}
