import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatInputModule,
  MatProgressBarModule
 } from '@angular/material';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CommonPipesModule } from "../../pipes/common/common-pipes.module";

import { ProjectsComponent } from "./projects.component";
import { ProjectsOverviewComponent } from './projects-overview/projects-overview.component';
import { ProjectsSettingsComponent } from './projects-settings/projects-settings.component';
import { ProjectsBlankComponent } from './projects-blank/projects-blank.component';
import { ProjectsDownloadsComponent } from './projects-downloads/projects-downloads.component';
import { ProjectsRoutes } from "./projects.routing";
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    FileUploadModule,
    CommonPipesModule,
    AgmCoreModule,
    RouterModule.forChild(ProjectsRoutes)
  ],
  declarations: [ProjectsComponent, ProjectsOverviewComponent, ProjectsSettingsComponent, ProjectsDownloadsComponent, ProjectsBlankComponent]
})
export class ProjectsModule { }
