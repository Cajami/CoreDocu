import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  imports: [FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Output() onRefrescarEvent = new EventEmitter<void>();
  @Output() onNuevoEvent = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<string>();

  searchText: string = '';

  onRefrescar() {
    this.searchText = '';
    this.onRefrescarEvent.emit();
  }
  onNuevo() {
    this.onNuevoEvent.emit();
  }
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }

  clearSearch() {
    this.searchText = '';
    this.valueChange.emit('');
  }
}
