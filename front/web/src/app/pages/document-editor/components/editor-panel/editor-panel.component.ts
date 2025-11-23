import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Article } from '../../../../core/models/article';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VisorMarkdownComponent } from '../../../../shared/components/visor-markdown/visor-markdown.component';
import {
  ModalContainerComponent,
  ModalData,
} from '../../../../shared/components/modal-container/modal-container.component';
import { AttachmentManagerComponent } from '../attachment-manager/attachment-manager.component';
import { MarkdownExamplesComponent } from '../markdown-examples/markdown-examples.component';
import { ArticlesService } from '../../../../core/services/articles.service';
import { catchError, EMPTY, finalize, Subject, tap } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-editor-panel',
  imports: [CommonModule, FormsModule, VisorMarkdownComponent],
  templateUrl: './editor-panel.component.html',
  styleUrl: './editor-panel.component.scss',
})
export class EditorPanelComponent implements OnInit {
  @ViewChild('editor') editor!: ElementRef<HTMLTextAreaElement>;

  @Input({ required: true }) article!: Article;

  // private contenidoSubject = new Subject<string>(); //PAR LA SECCION ngOnInit

  modo: 'editar' | 'preview' = 'editar';
  scrollPos = 0; // posición guardada

  textMarkDown: string = '';
  textMarkDownOriginal: string = '';
  isSaveDisabled = true;

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private articlesService: ArticlesService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.inicializarDesdeArticle();
    // Aquí irá el autosave con debounce más adelante
    // Ejemplo (todavía desactivado):
    // this.contenidoSubject
    //   .pipe(debounceTime(10000))
    //   .subscribe(texto => this.guardarMarkdown());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['article'] && !changes['article'].firstChange) {
      this.inicializarDesdeArticle();
    }
  }

  onTextChange(nuevo: string) {
    this.isSaveDisabled = nuevo.trim() === this.textMarkDownOriginal.trim();
    // this.contenidoSubject.next(nuevo); //PAR LA SECCION ngOnInit
  }

  onScroll(txt: HTMLTextAreaElement) {
    this.scrollPos = txt.scrollTop;
  }

  inicializarDesdeArticle() {
    this.modo = 'editar';
    this.textMarkDown = this.article.content || '';
    this.textMarkDownOriginal = this.textMarkDown;
    this.isSaveDisabled = true;
    this.scrollPos = 0;
    if (this.editor) this.editor.nativeElement.scrollTop = this.scrollPos;
  }

  cambiarModo(m: 'editar' | 'preview') {
    this.modo = m;

    if (m === 'editar') {
      setTimeout(() => {
        if (this.editor?.nativeElement) {
          this.editor.nativeElement.scrollTop = this.scrollPos;
        }
      }, 0);
    } else {
      //preview
      this.textMarkDown = this.article.content || '';
      if (this.isSaveDisabled === false) this.guardarMarkdown();
    }
  }

  openExampleMarkdown() {
    const dialogRef = this.dialog.open(ModalContainerComponent, {
      data: {
        title: `Ejemplo Markdown`,
        component: MarkdownExamplesComponent,
        hideButtonSave: true,
      } as ModalData,

      width: '900px', // ← Aumenta el ancho
      panelClass: 'custom-dialog-panel',
      backdropClass: 'bg-black/50',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
    });
  }

  openAttachmentManager() {
    const dialogRef = this.dialog.open(ModalContainerComponent, {
      data: {
        title: `Archivos Adjuntos`,
        buttonHeader: '➕ Agregar archivo',
        component: AttachmentManagerComponent,
        hideButtonSave: true,
        data: { article: this.article },
      } as ModalData,

      width: '700px', // ← Aumenta el ancho
      maxWidth: '95vw', // ← Evita que se rompa en pantallas pequeñas
      height: 'auto',

      panelClass: 'custom-dialog-panel',
      backdropClass: 'bg-black/50',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
    });
  }

  guardarMarkdown() {
    if (!this.article) return;

    const request = {
      content: this.article.content,
    } as Article;

    this.article.loading = true;

    this.articlesService
      .update(this.article.id, request)
      .pipe(
        tap(() => {
          this.textMarkDownOriginal = this.article.content;
          this.toastService.success('Contenido guardado');
          this.isSaveDisabled = true;
        }),
        finalize(() => (this.article.loading = false)),
        catchError((err) => {
          this.toastService.error(err.message);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
