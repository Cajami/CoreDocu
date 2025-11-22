import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Section } from '../models/section';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { BaseCrudService } from './base-crud.service';
import { handleApiResponse } from '../utils/api-utils';

@Injectable({
  providedIn: 'root',
})
export class SectionsService extends BaseCrudService<Section> {
  protected override baseUrl = `${environment.apiUrl}${environment.apiRoutes.sections}`;

  getByProject(projectId: string): Observable<Section[]> {
    return this.http
      .get<ApiResponse<Section[]>>(`${this.baseUrl}/project/${projectId}`)
      .pipe(handleApiResponse<Section[]>());
  }

  updateOrder(request: Section[]) {
    return this.http
    .post<ApiResponse<Section[]>>(`${this.baseUrl}/reorder`, request)
      .pipe(handleApiResponse<Section[]>());
  }
}
