import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonText,
  IonButton,
  IonSpinner,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonInput,
    IonInputPasswordToggle,
    IonText,
    IonButton,
    IonSpinner,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.router.navigate(['/main/home']);
    }
  }

  async login() {
    if (this.form.invalid) return;
    this.loading = true;
    try {
      const { email, password } = this.form.value;
      const userCredential = await this.auth.login(email!, password!);

      // Store user info in localStorage
      const userInfo = {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || undefined,
        email: userCredential.user.email,
        createdAt:
          userCredential.user.metadata.creationTime || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      this.loading = false;

      // Show success toast
      await this.showSuccessToast();

      this.router.navigate(['/main/home']);
    } catch (err: any) {
      this.loading = false;
      // Show error alert
      await this.showErrorAlert('Invalid username or password');
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Login successful!',
      duration: 2000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }
}
