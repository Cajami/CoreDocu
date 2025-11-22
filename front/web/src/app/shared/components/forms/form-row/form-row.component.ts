import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-row',
  imports: [CommonModule],
  templateUrl: './form-row.component.html',
  styleUrl: './form-row.component.scss',
  host: {
    class: 'block w-full'  //
  }
})
export class FormRowComponent {
  @Input() cols = 1;

  get gridClass() {
    return `grid sm:grid-cols-${this.cols} grid-cols-1`;
  }
}
