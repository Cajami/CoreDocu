import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Project } from '../models/project';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/apiResponse';
import { BaseCrudService } from './base-crud.service';
import { handleApiResponse } from '../utils/api-utils';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService extends BaseCrudService<Project> {
  protected override baseUrl = `${environment.apiUrl}${environment.apiRoutes.projects}`;

  getAll(): Observable<Project[]> {
    return this.http
      .get<ApiResponse<Project[]>>(this.baseUrl)
      .pipe(handleApiResponse<Project[]>());
  }
}
