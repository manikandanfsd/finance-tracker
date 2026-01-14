import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import {
  addOutline,
  calendarOutline,
  cashOutline,
  createOutline,
  documentsOutline,
  documentTextOutline,
  fileTrayStackedOutline,
  gridOutline,
  home,
  homeOutline,
  informationCircleOutline,
  library,
  libraryOutline,
  listOutline,
  logOutOutline,
  menu,
  personOutline,
  playCircle,
  radio,
  reader,
  readerOutline,
  search,
  statsChartOutline,
  trash,
} from 'ionicons/icons';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Register commonly used icons globally
addIcons({
  menu,
  calendarOutline,
  documentsOutline,
  documentTextOutline,
  fileTrayStackedOutline,
  informationCircleOutline,
  home,
  radio,
  libraryOutline,
  search,
  addOutline,
  playCircle,
  trash,
  homeOutline,
  listOutline,
  personOutline,
  logOutOutline,
  cashOutline,
  createOutline,
  statsChartOutline,
  readerOutline,
  gridOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});
