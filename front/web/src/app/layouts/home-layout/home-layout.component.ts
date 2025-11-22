import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  SidebarBasicComponent,
  SidebarItem,
} from '../../shared/components/sidebar/sidebar-basic/sidebar-basic.component';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, SidebarBasicComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss',
})
export class HomeLayoutComponent {
  items: SidebarItem[] = [
    {
      icon: '├─',
      title: 'Proyectos',
      tag: 'project',
      disabled: false,
    },
    {
      icon: '├─',
      title: 'Configuración',
      tag: 'config',
      disabled: true,
    },
  ];
  constructor(private router: Router) {}

  logout() {
    // Aquí iría el cierre real (limpiar tokens, etc.)
    this.router.navigate(['/']);
  }

  onItemSelected(item: SidebarItem) {
    switch (item.tag) {
      case 'project':
        this.router.navigate(['project']);
        break;
    }
  }
}
