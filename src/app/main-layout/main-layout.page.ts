import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, IonTabs, IonTabBar, IonTabButton, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'main-layout.page.html',
})
export class MainLayoutComponent {}
