import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ContextMenuGlobalComponent } from './shared/components/context-menu-global/context-menu-global.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, ContextMenuGlobalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'coredocu_web';
}
