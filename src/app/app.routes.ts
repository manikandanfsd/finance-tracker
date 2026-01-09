import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/page/auth-layout/auth-layout.page').then(
        (m) => m.AuthLayoutComponent
      ),

    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/page/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/page/register/register.page').then(
            (m) => m.RegisterPage
          ),
      },
    ],
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./main-layout/main-layout.page').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./category/category.page').then((m) => m.CategoryPage),
      },
    ],
  },
];
