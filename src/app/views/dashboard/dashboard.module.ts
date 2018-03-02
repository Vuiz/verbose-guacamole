import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRadioModule,
  MatCheckboxModule,
  MatButtonModule,
  MatChipsModule,
  MatSelectModule,
  MatListModule,
  MatGridListModule,
  MatStepperModule,
  MatSliderModule,
  MatSlideToggleModule
 } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonPipesModule } from "../../pipes/common/common-pipes.module";
import { CommonDirectivesModule } from '../../directives/common/common-directives.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from "./dashboard.routing";
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AgmCoreModule } from '@agm/core';
import { MomentModule } from 'angular2-moment';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    AgmCoreModule,
    MomentModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatStepperModule,
    FlexLayoutModule,
    ChartsModule,
    NgxCarouselModule,
    NgxDatatableModule,
    CommonPipesModule,
    CommonDirectivesModule,
    AgmCoreModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [ DashboardComponent],
  exports: []
})
export class DashboardModule {

}
