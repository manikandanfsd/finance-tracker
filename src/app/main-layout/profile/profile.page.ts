import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth';

interface UserInfo {
  uid: string;
  email: string | null;
  createdAt: string;
  lastLogin: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfilePage implements OnInit {
  userInfo: UserInfo | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      this.userInfo = JSON.parse(userInfoString);
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: async () => {
            try {
              await this.auth.logout();
              localStorage.removeItem('userInfo');
              this.router.navigate(['/auth/login']);
            } catch (err) {
              console.error('Logout error:', err);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
