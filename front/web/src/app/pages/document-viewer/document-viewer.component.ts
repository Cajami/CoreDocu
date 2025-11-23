import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../core/models/project';
import { Article } from '../../core/models/article';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../core/services/projects.service';
import { SidebarProjectComponent } from '../../shared/components/sidebar/sidebar-project/sidebar-project.component';
import { VisorMarkdownComponent } from '../../shared/components/visor-markdown/visor-markdown.component';
import { SectionsService } from '../../core/services/sections.service';
import { ArticlesService } from '../../core/services/articles.service';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { Section } from '../../core/models/section';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-document-viewer',
  imports: [SidebarProjectComponent, VisorMarkdownComponent],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
})
export class DocumentViewerComponent implements OnInit {
  @ViewChild('main') main!: ElementRef;

  project: Project = {} as Project;
  selectedArticle?: Article;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private sectionsService: SectionsService,
    private articlesService: ArticlesService,
    private toastService:ToastService
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
          this.toastService.error(err.message);
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
          this.toastService.error(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  onSelectArticle(item: Article) {
    this.selectedArticle = item;
    this.main.nativeElement.scrollTop = 0;
  }

  finishEditing() {
    this.router.navigate(['/project']);
  }
}
