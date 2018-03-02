import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
export interface Roles {
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }
export interface User {
    uid: string;
    email: string;
    roles: Roles;
    photoURL?: string;
    displayName?: string;
 }
@Injectable()
export class CoreAuthService {

  user$: Observable<User>;
  constructor(public afAuth: AngularFireAuth,
              public afs: AngularFirestore,
              private router: Router) {
      //// Get auth data, then get firestore user document || null
      this.user$ = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        })
  }

  ///// Login/Signup //////
  googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider()
  return this.oAuthLogin(provider);
  }
  private oAuthLogin(provider) {
  return this.afAuth.auth.signInWithPopup(provider)
    .then((credential) => {
      this.updateUserData(credential.user)
    })
  }
  private updateUserData(user) {
  // Sets user data to firestore on login
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  const data: User = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    roles: {
      subscriber: true
    }
  }
  console.log("display name is: " + data.displayName);
  return userRef.set(data, { merge: true })
  }
    signOut() {
      this.afAuth.auth.signOut().then(() => {
          this.router.navigate(['/sessions/signin']);
      });
    }

  public emailAndPassLogin(signinData){
  this.afAuth.auth.signInWithEmailAndPassword(signinData.username, signinData.password)
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
    })
    .then((credential) => {
      console.log(credential.user.email);
      this.updateUserData(credential.user);
    });
   }

  public loggedInCheck(user){
    this.afAuth.authState.subscribe(res => {
    if(res && res.uid){
      return true;
    }else{
      return false;
    }
  })

  }
  /*public updateUserData(user){
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data);
  }*/

}
