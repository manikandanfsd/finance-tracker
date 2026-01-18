import { Component } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  passwordsMatch() {
    return this.form.value.password === this.form.value.confirmPassword;
  }

  async register() {
    if (this.form.invalid || !this.passwordsMatch()) return;

    this.loading = true;
    try {
      const { email, password } = this.form.value;
      await this.auth.register(email!, password!);
      this.loading = false;

      // Show success toast
      await this.showSuccessToast();

      // Navigate to login page
      this.router.navigate(['/auth/login']);
    } catch (err: any) {
      this.loading = false;

      // Show error alert
      await this.showErrorAlert('Email already in use');
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registration Failed',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Registration successful! Please login.',
      duration: 2500,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }
}
