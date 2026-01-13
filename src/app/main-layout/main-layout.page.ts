import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  listOutline,
  personOutline,
  logOutOutline,
} from 'ionicons/icons';

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
    { title: 'Categories', url: '/main/category', icon: 'list-outline' },
    // { title: 'Profile', url: '/main/profile', icon: 'person-outline' },
  ];

  constructor(private auth: AuthService, private router: Router) {
    addIcons({ homeOutline, listOutline, personOutline, logOutOutline });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
