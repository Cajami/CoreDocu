import { Component, HostListener } from '@angular/core';
import {
  ContextMenuGlobalService,
  ContextMenuGlobalState,
} from '../../../core/services/context-menu-global.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-context-menu-global',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './context-menu-global.component.html',
  styleUrl: './context-menu-global.component.scss',
})
export class ContextMenuGlobalComponent {
  state$: Observable<ContextMenuGlobalState>;

  constructor(private ctx: ContextMenuGlobalService) {
    this.state$ = ctx.state$;
  }

  @HostListener('document:click')
  onClickOutside() {
    this.ctx.close();
  }
}
