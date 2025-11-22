import { Component, forwardRef, Input, Optional } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() formControlName!: string;

  @Input() value = '';
  @Input()
  isDisabled = false;

  constructor(@Optional() private controlContainer: ControlContainer) {}

  // ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};
  writeValue(value: any): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  get control(): FormControl | null {
    return this.controlContainer?.control?.get(
      this.formControlName
    ) as FormControl;
  }

  get isRequired(): boolean {
    if (!this.control?.validator) return false;
    const validator = this.control.validator({} as any);
    return validator?.['required'] ?? false;
  }
}
