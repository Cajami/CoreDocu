import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  inject,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';

export interface ModalData {
  title?: string;
  buttonHeader?: string;
  component: Type<any>;
  data?: any;
  hideButtonSave: boolean;
}

@Component({
  selector: 'app-modal-container',
  imports: [CommonModule, DragDropModule],
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss',
})
export class ModalContainerComponent implements AfterViewInit {
  dialogRef = inject(MatDialogRef<ModalContainerComponent>);
  data = inject<ModalData>(MAT_DIALOG_DATA);
  injector = inject(Injector);

  @ViewChild('dynamicHost', { read: ViewContainerRef }) host!: ViewContainerRef;
  componentRef!: ComponentRef<any>;

  ngAfterViewInit() {
    this.loadComponent();
  }

  loadComponent() {
    this.host.clear();
    this.componentRef = this.host.createComponent(this.data.component, {
      injector: this.injector,
    });

    if (this.data.data) {
      Object.assign(this.componentRef.instance, this.data.data);
    }

    this.componentRef.instance?.closeModal
      .pipe(take(1))
      .subscribe((res: any) => this.dialogRef.close(res));
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.componentRef.instance.save) {
      this.componentRef.instance.save();
    }
  }
  buttonHeaderClic() {
    if (this.componentRef.instance.save) {
      this.componentRef.instance.buttonHeaderClic();
    }
  }
}
