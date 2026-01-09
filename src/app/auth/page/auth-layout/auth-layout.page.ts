import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [IonicModule, RouterModule],
  templateUrl: 'auth-layout.page.html',
})
export class AuthLayoutComponent {}
