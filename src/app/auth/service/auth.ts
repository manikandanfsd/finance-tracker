import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  updateDisplayName(name: string) {
    const user = this.auth.currentUser;
    if (user) {
      return updateProfile(user, { displayName: name });
    }
    return Promise.reject('No user logged in');
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
