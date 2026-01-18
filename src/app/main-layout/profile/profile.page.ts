import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth';
import { FormsModule } from '@angular/forms';

interface UserInfo {
  uid: string;
  name?: string;
  email: string | null;
  createdAt: string;
  lastLogin: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage implements OnInit {
  userInfo: UserInfo | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      this.userInfo = JSON.parse(userInfoString);
    } else {
      // Load from Firebase Auth if not in localStorage
      const currentUser = this.auth.getCurrentUser();
      if (currentUser) {
        this.userInfo = {
          uid: currentUser.uid,
          name: currentUser.displayName || undefined,
          email: currentUser.email,
          createdAt:
            currentUser.metadata.creationTime || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
      }
    }
  }

  async editName() {
    const alert = await this.alertController.create({
      header: 'Edit Name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Enter your name',
          value: this.userInfo?.name || '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.name && data.name.trim()) {
              await this.updateName(data.name.trim());
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async updateName(newName: string) {
    try {
      // Update Firebase Auth displayName
      await this.auth.updateDisplayName(newName);

      // Update localStorage
      if (this.userInfo) {
        this.userInfo.name = newName;
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
      }

      // Show success toast
      const toast = await this.toastController.create({
        message: 'Name updated successfully!',
        duration: 2000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle-outline',
      });
      await toast.present();
    } catch (err) {
      // Show error alert
      const alert = await this.alertController.create({
        header: 'Update Failed',
        message: 'Failed to update name. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
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
