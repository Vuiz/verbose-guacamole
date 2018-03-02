import { Routes } from '@angular/router';

import { ProjectsComponent } from "./projects.component";
import { ProjectsOverviewComponent } from "./projects-overview/projects-overview.component";
import { ProjectsSettingsComponent } from "./projects-settings/projects-settings.component";
import { ProjectsBlankComponent } from "./projects-blank/projects-blank.component";
import { ProjectsDownloadsComponent } from './projects-downloads/projects-downloads.component';

export const ProjectsRoutes: Routes = [
  {
    path: ':id',
    component: ProjectsComponent,
    data: { title: '', breadcrumb: '' },
    children: [{
      path: 'overview',
      component: ProjectsOverviewComponent,
      data: { title: 'Overview', breadcrumb: 'OVERVIEW' }
    },
    {
      path: 'edit',
      component: ProjectsSettingsComponent,
      data: { title: 'Edit Details', breadcrumb: 'EDIT ' }
    },
    {
      path: 'invoices',
      component: ProjectsBlankComponent,
      data: { title: 'Invoices', breadcrumb: 'INVOICES' }
    },
    {
      path: 'downloads',
      component: ProjectsDownloadsComponent,
      data: { title: 'Downloads', breadcrumb: 'DOWNLOADS' }
    }]
  }
];
