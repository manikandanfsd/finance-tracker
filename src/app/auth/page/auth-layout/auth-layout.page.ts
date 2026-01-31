import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule, IonApp, IonRouterOutlet],
  templateUrl: 'auth-layout.page.html',
})
export class AuthLayoutComponent {}
