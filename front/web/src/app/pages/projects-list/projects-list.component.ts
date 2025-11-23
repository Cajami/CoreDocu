import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Project } from '../../core/models/project';
import { ProjectsService } from '../../core/services/projects.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SpinnerLocalComponent } from '../../shared/components/spinner-local/spinner-local.component';
import { CardProjectComponent } from './components/card-project/card-project.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalContainerComponent } from '../../shared/components/modal-container/modal-container.component';
import { ProjectCreateComponent } from '../project-create/project-create.component';
import { catchError, EMPTY, tap } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-projects-list',
  imports: [
    CommonModule,
    ToolbarComponent,
    SpinnerLocalComponent,
    CardProjectComponent,
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  projectsFilter: Project[] = [];
  loading: boolean = false;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.projectsService
      .getAll()
      .pipe(
        tap((response) => {
          this.loading = false;
          this.projects = response;
          this.projectsFilter = this.projects;
        }),
        catchError((error) => {
          this.loading = false;
          this.toastService.error(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onSearch(texto: string) {
    texto = texto.toLowerCase();
    this.projectsFilter = this.projects.filter(
      (x) =>
        x.name?.toLowerCase().includes(texto) ||
        x.description?.toLowerCase().includes(texto)
    );
  }

  createProject() {
    this.abrirModalProject('Nuevo Proyecto');
  }

  editProject(item: Project) {
    this.abrirModalProject('Editar Proyecto', item);
  }

  abrirModalProject(title: string, item: Project | null = null) {
    const dialogRef = this.dialog.open(ModalContainerComponent, {
      data: {
        title: title,
        component: ProjectCreateComponent,
        data: { item },
      },
      panelClass: 'custom-dialog-panel',
      backdropClass: 'bg-black/50',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.getAll();
    });
  }

  openEditor(project: Project) {
    this.router.navigate(['/editor', project.id]);
  }

  openViewer(project: Project) {
    this.router.navigate(['/viewer', project.id]);
  }
}
