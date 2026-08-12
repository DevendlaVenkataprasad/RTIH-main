import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { InnerBannerComponent } from '../inner-banner/inner-banner.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';

@Component({
  selector: 'app-careers-rtih',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InnerBannerComponent,
    HeaderRtihComponent,
    FooterRtihComponent,
  ],
  templateUrl: './careers-rtih.component.html',
  styleUrls: ['./careers-rtih.component.scss'],
})
export class CareersRtihComponent implements OnInit, OnDestroy {
  active: 'exploration' | 'pre-incubation' = 'exploration';

  @ViewChildren('progSection', { read: ElementRef }) sections!: QueryList<
    ElementRef<HTMLElement>
  >;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // No cleanup needed currently
  }

  scrollTo(id: 'exploration' | 'pre-incubation'): void {
    this.active = id;
    this.router.navigate([], { fragment: id, replaceUrl: true });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goHomeFragment(fragment: string): void {
    console.log(fragment);
    this.router.navigate(['/home'], { fragment });
  }
}
