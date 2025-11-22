import { Routes } from '@angular/router';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { DocumenEditorComponent } from './pages/document-editor/document-editor.component';
import { DocumentViewerComponent } from './pages/document-viewer/document-viewer.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'project',
        loadComponent: () =>
          import('./pages/projects-list/projects-list.component').then(
            (m) => m.ProjectsListComponent
          ),
      },
    ],
  },
  {
    path: 'editor/:id',
    component: DocumenEditorComponent,
  },
  {
    path: 'viewer/:id',
    component: DocumentViewerComponent,
  },

  { path: '**', redirectTo: '' },
];
