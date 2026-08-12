import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {

  constructor(private router: Router) {
  this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
    if (!e.urlAfterRedirects.includes('#')) {
      history.replaceState(null, '', e.urlAfterRedirects.split('#')[0]);
      window.scrollTo({ top: 0 });
    }
  });
}

}
