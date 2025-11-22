import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-local',
  imports: [],
  templateUrl: './spinner-local.component.html',
  styleUrl: './spinner-local.component.scss',
})
export class SpinnerLocalComponent {
  @Input() textShow: string = 'Cargando...';
}
