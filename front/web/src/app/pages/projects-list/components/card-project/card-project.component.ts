import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../../../core/models/project';

@Component({
  selector: 'app-card-project',
  imports: [],
  templateUrl: './card-project.component.html',
  styleUrl: './card-project.component.scss',
})
export class CardProjectComponent {
  @Input() project!: Project;
  @Output() onEditorEvent = new EventEmitter<Project>();
  @Output() onViewEvent = new EventEmitter<Project>();
  @Output() onEditProjectEvent = new EventEmitter<Project>();

  openEditor() {
    this.onEditorEvent.emit(this.project);
  }

  openViewer() {
    this.onViewEvent.emit(this.project);
  }

  openEditProject() {
    this.onEditProjectEvent.emit(this.project);
  }
}
