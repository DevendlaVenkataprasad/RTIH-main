import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component'
@Component({
  selector: 'app-inner-banner',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  template: `
  <section class="inner-banner" [ngStyle]="{'--bg': 'url(' + (bg || defaultBg) + ')'}">
    <div class="container">
      <div class="left">
        <h1>{{ title }}</h1>
        <app-breadcrumbs *ngIf="showBreadcrumbs"></app-breadcrumbs>
      </div>
      <!-- <p class="right" *ngIf="subtext">{{ subtext }}</p> -->
      <p class="right" [innerHTML]="subtext"></p>

    </div>
    <!-- <span class="accent"></span> -->
  </section>
  `,
  styleUrls: ['./inner-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnerBannerComponent {
  /** Page title */
  @Input() title = 'About Us';
  /** Optional subtitle paragraph on the right */
  @Input() subtext?: string;
  /** Optional background image: assets/your-image.png */
  @Input() bg?: string;
  /** Hide/show breadcrumbs */
  @Input() showBreadcrumbs = true;

  defaultBg = 'assets/inner-banner-bg.png'; // place your image here
}
