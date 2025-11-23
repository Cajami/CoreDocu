import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormRowComponent } from '../../shared/components/forms/form-row/form-row.component';
import { FormInputComponent } from '../../shared/components/forms/form-input/form-input.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Project } from '../../core/models/project';
import { ProjectsService } from '../../core/services/projects.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-project-create',
  imports: [ReactiveFormsModule, FormRowComponent, FormInputComponent],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss',
})
export class ProjectCreateComponent implements OnInit {
  form: FormGroup;
  item: Project | null = null;

  @Output() closeModal = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.item !== null) {
      this.form.get('id')?.setValue(this.item.id);
      this.form.get('name')?.setValue(this.item.name);
      this.form.get('description')?.setValue(this.item.description);
    }
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const dataForm = this.form.getRawValue();

    const request = {
      name: dataForm.name,
      description: dataForm.description,
    } as Project;

    let send;
    let mensajeOK = '';
    if (this.item?.id) {
      //MODIFICAMOS
      send = this.projectsService.update(this.item.id, request);
      mensajeOK = 'Registro modificadó correctamente';
    } else {
      //INSERTAMOS
      send = this.projectsService.create(request);
      mensajeOK = 'Registro guardado correctamente';
    }
    send
      .pipe(
        tap((response) => {
          this.closeModal.emit(true);
          this.toastService.success(mensajeOK);
        }),
        catchError((error) => {
          this.toastService.error(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
