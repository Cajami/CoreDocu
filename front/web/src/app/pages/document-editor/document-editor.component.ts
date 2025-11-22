import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Section } from '../../core/models/section';
import { Article } from '../../core/models/article';
import { Project } from '../../core/models/project';
import { FormsModule } from '@angular/forms';
import { SidebarProjectComponent } from '../../shared/components/sidebar/sidebar-project/sidebar-project.component';
import { SectionsService } from '../../core/services/sections.service';
import { ProjectsService } from '../../core/services/projects.service';
import { catchError, EMPTY, finalize, Observable, switchMap, tap } from 'rxjs';
import { ArticlesService } from '../../core/services/articles.service';
import { EditorPanelComponent } from './components/editor-panel/editor-panel.component';

@Component({
  selector: 'app-document-editor',
  imports: [FormsModule, SidebarProjectComponent, EditorPanelComponent],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss',
})
export class DocumenEditorComponent {
  project: Project = {} as Project;
  selectedArticle?: Article;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private sectionsService: SectionsService,
    private articlesService: ArticlesService
  ) {}

  ngOnInit() {
    let projectId = this.route.snapshot.paramMap.get('id');
    if (!projectId) return this.finishEditing();

    //RECUPERAMOS EL PROYECTO
    this.projectsService
      .getById(projectId)
      .pipe(
        tap((project) => (this.project = project)),
        switchMap(() => this.sectionsService.getByProject(this.project.id)),
        tap((sections) => (this.project.sections = sections)),
        catchError((err) => {
          alert(err.message);
          this.finishEditing();
          return EMPTY;
        })
      )
      .subscribe();
  }

  onLoadArticles(section: Section): void {
    section.loading = true;
    this.articlesService
      .getBySection(section.id)
      .pipe(
        tap((article) => (section.articles = article)),
        finalize(() => (section.loading = false)),
        catchError((err) => {
          alert(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onEditSection(item: Section) {
    let idTemporal = '';
    let operation$: Observable<any>;

    item.loading = true;

    if (item.id === 'NEW') {
      idTemporal = crypto.randomUUID();
      item.id = idTemporal;

      operation$ = this.sectionsService.create({
        projectId: item.projectId,
        title: item.title,
      } as Section);
    } else {
      operation$ = this.sectionsService.update(item.id, {
        title: item.title,
      } as Section);
    }

    operation$
      .pipe(
        tap((response) => {
          item.id = response;
          item.articles ??= [];
        }),
        finalize(() => (item.loading = false)),
        catchError((err) => {
          alert(err.message);

          if (idTemporal !== '') {
            this.project.sections = this.project.sections.filter(
              (s) => s.id !== idTemporal
            );
          }

          return EMPTY;
        })
      )
      .subscribe();
  }

  onEditOrderSection(lista: Section[]) {
    this.sectionsService
      .updateOrder(lista)
      .pipe(
        catchError((err) => {
          alert(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onEditArticle(item: Article) {
    let idTemporal = '';
    let operation$: Observable<any>;

    item.loading = true;

    if (item.id === 'NEW') {
      idTemporal = crypto.randomUUID();
      item.id = idTemporal;

      operation$ = this.articlesService.create({
        sectionId: item.sectionId,
        title: item.title,
      } as Article);
    } else {
      operation$ = this.articlesService.update(item.id, {
        title: item.title,
      } as Article);
    }

    operation$
      .pipe(
        tap((response) => {
          item.id = response;
        }),
        finalize(() => (item.loading = false)),
        catchError((err) => {
          alert(err.message);

          if (idTemporal !== '') {
            const parentSection = this.project.sections.find(
              (s) => s.id === item.sectionId
            );

            if (parentSection) {
              this.project.sections = this.project.sections.filter(
                (s) => s.id !== idTemporal
              );
            }
          }

          return EMPTY;
        })
      )
      .subscribe();
  }

  onEditOrderArticle(lista: Article[]) {
    this.articlesService
      .updateOrder(lista)
      .pipe(
        catchError((err) => {
          alert(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onDeleteSection(item: Section) {
    if (item.articles && item.articles.length > 0)
      return alert(
        `La sección ${item.title} tiene ${item.articles.length} artículo(s) creados`
      );

    item.loading = true;

    this.sectionsService
      .delete(item.id)
      .pipe(
        tap((response) => {
          this.project.sections = this.project.sections.filter(
            (s) => s.id !== item.id
          );
        }),
        finalize(() => (item.loading = false)),
        catchError((err) => {
          alert(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onDeleteArticle(item: Article) {
    item.loading = true;

    this.articlesService
      .delete(item.id)
      .pipe(
        tap((response) => {
          const parentSection = this.project.sections.find(
            (s) => s.id === item.sectionId
          );

          if (parentSection) {
            parentSection.articles = parentSection.articles.filter(
              (s) => s.id !== item.id
            );
          }
        }),
        finalize(() => (item.loading = false)),
        catchError((err) => {
          alert(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onSelectArticle(item: Article) {
    if (!item.attachments || item.attachments?.length === 0) {
      item.loading = true;
      this.articlesService
        .getAttachmentsByArticle(item.id)
        .pipe(
          tap((attchmens) => {
            item.attachments = attchmens;
            this.selectedArticle = item;
          }),
          finalize(() => (item.loading = false)),
          catchError((err) => {
            alert(err.message);
            return EMPTY;
          })
        )
        .subscribe();
    } else this.selectedArticle = item;
  }

  finishEditing() {
    this.router.navigate(['/project']);
  }
}
