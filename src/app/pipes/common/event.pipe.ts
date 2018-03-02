import { Pipe, PipeTransform } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Subscription } from "rxjs/Subscription";
import { FirestoreService } from '../../services/firestore/firestore.service';

@Pipe({
  name: 'Event'
})
export class EventPipe implements PipeTransform {
  constructor(private db: FirestoreService) {}

  transform(value: any): Observable<any> {
    return this.db.doc$(value.path);
  }

}
