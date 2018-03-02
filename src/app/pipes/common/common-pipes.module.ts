import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time.pipe';
import { ExcerptPipe } from "./excerpt.pipe";
import { EventPipe } from "./event.pipe";
@NgModule({
  declarations: [
    RelativeTimePipe,
    ExcerptPipe,
    EventPipe
  ],
  exports: [
    RelativeTimePipe,
    ExcerptPipe,
    EventPipe
  ]
})
export class CommonPipesModule { }
