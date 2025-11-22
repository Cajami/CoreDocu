import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';

export function handleApiResponse<T>() {
  return (source: Observable<ApiResponse<T>>): Observable<T> => {
    return source.pipe(
      map((res) => {
        if (!res?.success) {
          throw new Error(
            res?.errors?.[0] || 'Error al procesar la respuesta del servicio'
          );
        }
        return res.data!;
      }),
      catchError((err) => {
        return throwError(
          () => new Error('Error al conectarse con el servicio')
        );
      })
    );
  };
}
