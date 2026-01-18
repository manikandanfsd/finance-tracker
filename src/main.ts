import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import {
  add,
  addOutline,
  arrowDown,
  arrowDownOutline,
  arrowUp,
  arrowUpOutline,
  calendarOutline,
  cashOutline,
  checkmarkCircleOutline,
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
  personAdd,
  personOutline,
  playCircle,
  radio,
  reader,
  readerOutline,
  remove,
  search,
  statsChartOutline,
  swapHorizontal,
  trash,
  wallet,
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
  wallet,
  checkmarkCircleOutline,
  personAdd,
  arrowDown,
  arrowUp,
  add,
  remove,
  swapHorizontal,
  arrowUpOutline,
  arrowDownOutline,
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
