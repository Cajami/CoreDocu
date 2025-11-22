import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { Article } from '../models/article';
import { environment } from '../../../environments/environment';
import { filter, map, Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { handleApiResponse } from '../utils/api-utils';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Attachment } from '../models/attachment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService extends BaseCrudService<Article> {
  protected override baseUrl = `${environment.apiUrl}${environment.apiRoutes.articles}`;

  getBySection(sectionId: string): Observable<Article[]> {
    return this.http
      .get<ApiResponse<Article[]>>(`${this.baseUrl}/section/${sectionId}`)
      .pipe(handleApiResponse<Article[]>());
  }

  getAttachmentsByArticle(articleId: string): Observable<Attachment[]> {
    return this.http
      .get<ApiResponse<Attachment[]>>(
        `${this.baseUrl}/${articleId}/attachments/`
      )
      .pipe(handleApiResponse<Attachment[]>());
  }

  updateOrder(request: Article[]) {
    return this.http
      .post<ApiResponse<Article[]>>(`${this.baseUrl}/reorder`, request)
      .pipe(handleApiResponse<Article[]>());
  }

  /**
   * Sube un archivo adjunto
   */
  uploadAttachment(
    articleId: string,
    request: FormData
  ): Observable<HttpEvent<ApiResponse<string>>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/${articleId}/upload`,
      request,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
