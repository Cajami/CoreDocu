import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ArticlesService } from '../../../../core/services/articles.service';
import { Attachment } from '../../../../core/models/attachment';
import { VALID_EXTENSIONS } from '../../../../core/constants/file-types';
import { Article } from '../../../../core/models/article';
import { catchError, EMPTY, filter, finalize, map, tap } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { ApiResponse } from '../../../../core/models/apiResponse';
import {
  formatFileSize,
  getAcceptString,
  getFileIcon,
} from '../../../../core/utils/file-utils';
import { toast } from 'ngx-sonner';
import { ContextMenuGlobalService } from '../../../../core/services/context-menu-global.service';

@Component({
  selector: 'app-attachment-manager',
  imports: [],
  templateUrl: './attachment-manager.component.html',
  styleUrl: './attachment-manager.component.scss',
})
export class AttachmentManagerComponent implements OnInit {
  protected readonly toast = toast;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input({ required: true }) article!: Article;
  @Output() closeModal = new EventEmitter<any>();

  selectedFile?: File;

  validExtensions = VALID_EXTENSIONS;
  getFileIcon = getFileIcon;
  acceptString = getAcceptString();
  formatFileSize = formatFileSize;

  constructor(
    private articlesService: ArticlesService,
    private contextMenuService: ContextMenuGlobalService
  ) {}

  ngOnInit() {}

  copiarMarkdown(file: Attachment, mode: 'normal' | 'panzoom' = 'normal') {
    const isImage = /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file.fileName);
    const isSvg = this.isSvg(file);

    const url = `/api/articles/${file.articleId}/attachment/${file.id}`;

    let markdown = '';

    if (isImage) {
      markdown = `![${file.fileName}](${url})`;

      // Si es SVG y modo especial
      if (isSvg && mode === 'panzoom') {
        markdown += `{.svg-panzoom}`;
      }
    } else {
      markdown = `<a href="${url}" target="_blank">${file.fileName}</a>`;
    }

    navigator.clipboard.writeText(markdown).then(() => {
      this.toast.success('Copiado en portapapeles', { duration: 1000 });
    });

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !this.validExtensions.includes(extension)) {
      alert('❌ Tipo de archivo no permitido.');
      this.fileInput.nativeElement.value = '';
      return;
    }

    const newFile = {
      id: crypto.randomUUID(),
      articleId: this.article.id,
      fileName: file.name,
      size: file.size,
      contentType: file.type,
      uploading: true,
      progress: 0,
    } as Attachment;

    (this.article.attachments ??= []).push(newFile);

    const request = new FormData();
    request.append('file', file);

    this.articlesService
      .uploadAttachment(this.article.id, request)
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            newFile.progress = Math.round((event.loaded / event.total) * 100);
          }
        }),
        finalize(() => (newFile.uploading = false)),
        filter((event) => event.type === HttpEventType.Response),
        map((event) => event.body as ApiResponse<string>),
        tap((response) => (newFile.id = response.data!)),
        catchError(({ error }) => {
          this.article.attachments = this.article.attachments.filter(
            (a) => a.id !== newFile.id
          );
          if (!error?.success)
            alert(
              error?.errors?.[0] ||
                'Error al procesar la respuesta del servicio'
            );
          else alert('Error al conectarse con el servicio');

          return EMPTY;
        })
      )
      .subscribe();

    this.fileInput.nativeElement.value = '';
  }

  private removeTempAttachment(id: string) {
    this.article.attachments = this.article.attachments.filter(
      (a) => a.id !== id
    );
  }

  deleteFile(file: Attachment) {}

  save(): void {}

  buttonHeaderClic(): void {
    this.fileInput.nativeElement.click();
  }

  // Detectar si es SVG
  isSvg(file: Attachment): boolean {
    return file.fileName.toLowerCase().endsWith('.svg');
  }

  // Toggle del menú
  toggleMenu(file: Attachment, event: MouseEvent) {

    this.contextMenuService.open(event.clientX, event.clientY, [
      {
        label: '🖼️ Copiar como imagen',
        action: () => this.copiarMarkdown(file),
      },
      {
        label: '📐 Copiar como SVG',
        action: () => this.copiarMarkdown(file, 'panzoom'),
      },
    ]);

    event.stopPropagation();
    event.preventDefault();
  }
}
