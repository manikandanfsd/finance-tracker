import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule, IonApp, IonRouterOutlet],
  templateUrl: 'auth-layout.page.html',
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  private backButtonListener: any;

  constructor(
    private platform: Platform,
    private router: Router,
  ) {}

  ngOnInit() {
    // Handle hardware back button in auth pages
    this.backButtonListener = this.platform.backButton.subscribeWithPriority(
      10,
      () => {
        // If on login page, exit the app
        if (this.router.url === '/auth/login' || this.router.url === '/auth') {
          App.exitApp();
        }
        // If on register page, go back to login
        else if (this.router.url === '/auth/register') {
          this.router.navigate(['/auth/login'], { replaceUrl: true });
        }
      },
    );
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.backButtonListener) {
      this.backButtonListener.unsubscribe();
    }
  }
}
