import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [IonicModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'main-layout.page.html',
})
export class MainLayoutComponent {
  menuItems = [
    { title: 'Home', url: '/main/tabs', icon: 'home-outline' },
    {
      title: 'Transactions',
      url: '/main/transactions',
      icon: 'reader-outline',
    },
    {
      title: 'Categories',
      url: '/main/tabs/category',
      icon: 'library-outline',
    },
    {
      title: 'Reports',
      url: '/main/tabs/reports',
      icon: 'stats-chart-outline',
    },
    // { title: 'Profile', url: '/main/profile', icon: 'person-outline' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
