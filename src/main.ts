import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig, // keep your global providers/config
  providers: [
    // ✅ Router configuration
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',          // scrolls to element with #id
        scrollPositionRestoration: 'top'     // always starts at top for new routes
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload'        // re-run navigation if same URL clicked again
      })
    ),

    ...(appConfig.providers || [])
  ]
}).catch(err => console.error(err));
