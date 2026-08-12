import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
export interface Crumb { label: string; url: string; }

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="crumbs" aria-label="breadcrumb">
      <a class="crumb" routerLink="/">Home</a>
      <ng-container *ngFor="let c of trail; let last = last">
        <span class="sep">/</span>
        <a *ngIf="!last" class="crumb" [routerLink]="c.url">{{ c.label }}</a>
        <span *ngIf="last" class="crumb current">{{ c.label }}</span>
      </ng-container>
    </nav>
  `,
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
  trail: Crumb[] = [];

  constructor(private router: Router, private ar: ActivatedRoute) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.buildTrail(this.ar.root))
    ).subscribe(trail => this.trail = trail);
  }

  private buildTrail(route: ActivatedRoute, url = '', crumbs: Crumb[] = []): Crumb[] {
    const children = route.children;
    if (!children.length) return crumbs;

    for (const child of children) {
      const routeURL = child.snapshot.url.map(s => s.path).join('/');
      if (routeURL) url += `/${routeURL}`;

      const data = child.snapshot.data;
      const params: Params = child.snapshot.params;

      // prefer explicit breadcrumb label or function
      let label: string | null = null;
      if (typeof data['breadcrumb'] === 'function') {
        label = data['breadcrumb'](params, child.snapshot);
      } else if (typeof data['breadcrumb'] === 'string') {
        label = data['breadcrumb'];
      } else if (routeURL) {
        label = routeURL.replace(/-/g, ' ');
      }

      if (label) crumbs.push({ label, url });
      return this.buildTrail(child, url, crumbs);
    }
    return crumbs;
  }
}
