import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { handleApiResponse } from '../utils/api-utils';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseCrudService<T> {
  protected abstract baseUrl: string;

  constructor(protected http: HttpClient) {}

  getById(id: string): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${id}`)
      .pipe(handleApiResponse<T>());
  }

  create(item: T): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(this.baseUrl, item)
      .pipe(handleApiResponse<string>());
  }

  update(id: string, item: T): Observable<string> {
    return this.http
      .put<ApiResponse<string>>(`${this.baseUrl}/${id}`, item)
      .pipe(handleApiResponse<string>());
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`)
      .pipe(handleApiResponse<boolean>());
  }
}
