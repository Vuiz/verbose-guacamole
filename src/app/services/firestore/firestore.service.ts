import { Injectable } from '@angular/core';
import { AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { CoreAuthService } from "../../core-auth.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { expand, takeWhile, mergeMap, take } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/switchMap';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

//Define Project array

interface Project {
    ref_name: string;
    stage: string;
    progress: number;
    next_event_ref_path: string;
    date: Date;
  }

type CollectionPredicate<T>   = string |  AngularFirestoreCollection<T>;
type DocPredicate<T>          = string |  AngularFirestoreDocument<T>;
@Injectable()
export class FirestoreService {
userProjectsCol: AngularFirestoreCollection<Project>;

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) { }
  /// **************
  /// Get a Reference
  /// **************
  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref
  }
  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref
  }
  /// **************
  /// Get Data
  /// **************
  doc$<T>(ref:  DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().map(doc => {
      return doc.payload.data() as T
    })
  }
  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().map(docs => {
      return docs.map(a => a.payload.doc.data()) as T[]
    });
  }
  /// with Ids
  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }
  /// **************
  /// Write Data
  /// **************
  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }
  set<T>(ref: DocPredicate<T>, data: any) {
    const timestamp = this.timestamp
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    })
  }
  update<T>(ref: DocPredicate<T>, data: any) {
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp
    })
  }
  delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete()
  }
  add<T>(ref: CollectionPredicate<T>, data) {
    const timestamp = this.timestamp
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    })
  }
  geopoint(lat: number, lng: number) {
    return new firebase.firestore.GeoPoint(lat, lng)
  }
  /// If doc exists update, otherwise set
  upsert<T>(ref: DocPredicate<T>, data: any) {
    const doc = this.doc(ref).snapshotChanges().take(1).toPromise()
    return doc.then(snap => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data)
    })
  }
  /// **************
  /// Inspect Data
  /// **************
  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime()
    this.doc(ref).snapshotChanges()
        .take(1)
        .do(d => {
          const tock = new Date().getTime() - tick
          console.log(`Loaded Document in ${tock}ms`, d)
        })
        .subscribe()
  }
  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime()
    this.col(ref).snapshotChanges()
        .take(1)
        .do(c => {
          const tock = new Date().getTime() - tick
          console.log(`Loaded Collection in ${tock}ms`, c)
        })
        .subscribe()
  }
  /// **************
  /// Create and read doc references
  /// **************
  /// create a reference between two documents
  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref })
  }
  /// returns a documents references mapped to AngularFirestoreDocument
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).map(doc => {
      for (const k of Object.keys(doc)) {
        if (doc[k] instanceof firebase.firestore.DocumentReference) {
          doc[k] = this.doc(doc[k].path)
        }
      }
      return doc
    })
  }

  deleteCollection(path: string, batchSize: number): Observable<any> {

    const source = this.deleteBatch(path, batchSize)

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize)),
      takeWhile(val => val > 0)
   )

  }

  // Deletes documents as batched transaction
  private deleteBatch(path: string, batchSize: number): Observable<any> {
    const colRef = this.afs.collection(path, ref => ref.orderBy('__name__').limit(batchSize) )

    return colRef.snapshotChanges().pipe(
      take(1),
      mergeMap(snapshot => {

        // Delete documents in a batch
        const batch = this.afs.firestore.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.payload.doc.ref);
        });

        return fromPromise( batch.commit() ).map(() => snapshot.length)

      })
    )

  }

  /*// returns a documents events mapped to AngularFirestoreDocument
  docEvents$<T>(ref: DocPredicate<T>) {

    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {

        //Bind projects
        this.userProjectsCol = this.afs.collection('projects', ref => ref.where('master_user', '==', res.uid));

        return this.doc$(ref).map(doc => {
          for (const k of Object.keys(doc)) {
            if (doc[k]) {
              doc[k] = this.col('/projects/'+ k + "/events")
            }
          }
          return doc
        })
      }
    })
  }*/
}
