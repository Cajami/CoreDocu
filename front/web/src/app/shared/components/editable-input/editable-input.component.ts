import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-editable-input',
  imports: [],
  templateUrl: './editable-input.component.html',
  styleUrl: './editable-input.component.scss',
})
export class EditableInputComponent implements AfterViewInit {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  @Output() enterEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();
  @Output() escapeEvent = new EventEmitter<void>();

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  editingValue: string = '';
  originalValue: string = '';

  ignoreBlur = false;

  ngAfterViewInit() {
    this.editingValue = this.value;
    this.originalValue = this.value;

    // Auto focus y selecciona el texto cuando aparece el input
    setTimeout(() => {
      const el = this.inputEl.nativeElement;
      el.focus();
      el.select();
    }, 0);  
  }

  onBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }

    this.value = this.editingValue;
    this.valueChange.emit(this.value);
    this.blurEvent.emit();
  }

  onEnter() {
    this.ignoreBlur = true;
    this.value = this.editingValue;
    this.valueChange.emit(this.value);
    this.enterEvent.emit();
  }

  onEscape() {
    // revertimos al valor original
    this.editingValue = this.originalValue;
    this.value = this.originalValue;
    this.valueChange.emit(this.originalValue);
    this.escapeEvent.emit();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.editingValue = input.value;
  }
}
