import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { CoreAuthService } from '../../core-auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: CoreAuthService, private router: Router, public snackBar: MatSnackBar) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

      return this.auth.user$
           .take(1)
           .map(user => !!user)
           .do(loggedIn => {
             if (!loggedIn) {
               this.snackBar.open('Log in to access your dashboard', 'close', { duration: 2750 });
               this.router.navigate(['/sessions/signin']);
             }
         })

  }
}
