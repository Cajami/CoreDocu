import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface SidebarItem {
  icon: string;
  title: string;
  tag: string;
  disabled: boolean;
}

@Component({
  selector: 'app-sidebar-basic',
  imports: [CommonModule],
  templateUrl: './sidebar-basic.component.html',
  styleUrl: './sidebar-basic.component.scss',
})
export class SidebarBasicComponent {
  @Input() items: SidebarItem[] = [];
  @Output() onItemSelected = new EventEmitter<SidebarItem>();

  selectedTag: string | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const current = this.router.url.split('/')[1];
        this.selectedTag = current;
      });
  }

  itemSelected(item: SidebarItem) {
    this.selectedTag = item.tag;
    this.onItemSelected.emit(item);
  }
}