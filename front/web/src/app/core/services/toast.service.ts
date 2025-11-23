import { Injectable } from '@angular/core';
import { ExternalToast, toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  protected readonly toast = toast;

  success(message: string, data?: ExternalToast) {
    this.toast.success(message, data);
  }

  error(message: string, data?: ExternalToast) {
    this.toast.error(message, data);
  }
}
