import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonFab,
  IonFabButton,
  IonContent,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  library,
  playCircle,
  radio,
  search,
  home,
  addOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonIcon,
    IonTabBar,
    IonTabButton,
    IonTabs,
    RouterModule,
  ],
})
export class TabsPage implements OnInit {
  constructor() {
    addIcons({ home, radio, library, search, addOutline, playCircle });
  }

  ngOnInit() {}
}
