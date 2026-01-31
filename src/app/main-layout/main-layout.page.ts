import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  Platform,
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, IonTabs, IonTabBar, IonTabButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'main-layout.page.html',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private backButtonListener: any;

  constructor(
    private platform: Platform,
    private router: Router,
  ) {}

  ngOnInit() {
    // Handle hardware back button
    this.backButtonListener = this.platform.backButton.subscribeWithPriority(
      10,
      () => {
        // If on home tab, exit the app
        if (this.router.url === '/main/home' || this.router.url === '/main') {
          App.exitApp();
        }
        // Otherwise, let the default back navigation happen for other tabs
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
