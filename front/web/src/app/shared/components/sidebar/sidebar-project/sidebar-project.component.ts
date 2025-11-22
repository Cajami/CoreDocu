import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../../../core/models/project';
import { Section } from '../../../../core/models/section';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Article } from '../../../../core/models/article';
import { EditableInputComponent } from '../../editable-input/editable-input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContextMenuGlobalService } from '../../../../core/services/context-menu-global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-project',
  imports: [CommonModule, DragDropModule, EditableInputComponent, FormsModule],
  templateUrl: './sidebar-project.component.html',
  styleUrl: './sidebar-project.component.scss',
})
export class SidebarProjectComponent {
  @Input({ required: true }) project!: Project;
  @Input() selectedArticle?: Article;
  @Input() editar: boolean = true;

  @Output() onLoadArticles = new EventEmitter<Section>();
  @Output() onEditSection = new EventEmitter<Section>();
  @Output() onEditOrderSection = new EventEmitter<Section[]>();
  @Output() onEditArticle = new EventEmitter<Article>();
  @Output() onEditOrderArticle = new EventEmitter<Article[]>();
  @Output() onDeleteSection = new EventEmitter<Section>();
  @Output() onDeleteArticle = new EventEmitter<Article>();
  @Output() onSelectArticle = new EventEmitter<Article>();

  constructor(
    private contextMenuGlobalService: ContextMenuGlobalService,
    private router: Router
  ) {}

  idEdit: string = '';

  /*========= DRAG DROP =========*/
  dropSection(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.project?.sections!,
      event.previousIndex,
      event.currentIndex
    );

    // reconstruimos el orden
    const payload = this.project.sections.map((s, i) => ({
      id: s.id,
      projectId: s.projectId,
      order: i + 1,
    }));

    this.onEditOrderSection.emit(payload as Section[]);
  }

  dropArticle(event: CdkDragDrop<any[]>, section: Section) {
    moveItemInArray(section.articles, event.previousIndex, event.currentIndex);

    const payload = section.articles.map((a, i) => ({
      id: a.id,
      sectionId: section.id,
      order: i + 1,
    }));

    this.onEditOrderArticle.emit(payload as Article[]);
  }

  /*=============================*/

  onToggleSection(section: Section, event: Event): void {
    if (section.expanded && !section.articles?.length) {
      this.onLoadArticles.emit(section);
    }
  }

  /*========= CONTEXT MENU =========*/

  contextMenuOpenSection(event: MouseEvent, item: Section): void {
    const options = [
      { label: '✏️ Editar', action: () => (this.idEdit = item.id) },
      { label: '➕ Agregar', action: () => this.addArticle(item) },
    ];

    if (!item.articles?.length) {
      options.push({
        label: '🗑️ Eliminar',
        action: () => this.onDeleteSection.emit(item),
      });
    }

    this.openContextMenu(event, options);
  }
  contextMenuOpenArticle(event: MouseEvent, item: Article): void {
    const options = [
      { label: '✏️ Editar', action: () => (this.idEdit = item.id) },
      { label: '🗑️ Eliminar', action: () => this.onDeleteArticle.emit(item) },
    ];
    this.openContextMenu(event, options);
  }

  private openContextMenu(event: MouseEvent, options: any[]) {
    event.preventDefault();
    event.stopPropagation();

    this.contextMenuGlobalService.open(
      event.clientX,
      event.clientY,
      options,
      'text-sm w-32'
    );
  }

  /*================================*/

  stopEditSection(item: Section) {
    this.idEdit = '';
    this.onEditSection.emit(item);
  }
  stopEditArticle(item: Article) {
    this.idEdit = '';
    this.onEditArticle.emit(item);
  }

  selectArticle(item: Article) {
    this.selectedArticle = item;
    this.onSelectArticle.emit(item);
  }

  addSection() {
    if (!this.project) return;

    this.idEdit = 'NEW';
    this.project.sections.push({
      id: this.idEdit,
      projectId: this.project.id,
      title: 'Nuevo',
      articles: [],
      order: this.project.sections.length + 1,
    });
  }

  addArticle(item: Section) {
    item.expanded = true;
    this.idEdit = 'NEW';

    if (!item.articles) item.articles = [];

    item.articles.push({
      id: this.idEdit,
      sectionId: item.id,
      title: 'Nuevo',
      content: '',
      order: item.articles.length + 1,
      attachments: [],
    });
  }

  finishEditing() {
    this.router.navigate(['project']);
  }
}
