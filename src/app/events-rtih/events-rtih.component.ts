import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
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
  selector: 'app-events-rtih',
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
  templateUrl: './events-rtih.component.html',
  styleUrls: ['./events-rtih.component.scss']
})
export class EventsRtihComponent implements OnInit, AfterViewInit, OnDestroy
{
  ngOnInit(): void {}

  // 👇 Must match the ids in the HTML
  active:
    | 'exploration'
    | 'pre-incubation'
    | 'incubation'
    | 'workshop'
    | 'acceleration' = 'exploration';


  @ViewChildren('progSection', { read: ElementRef })
  sections!: QueryList<ElementRef<HTMLElement>>;

   @ViewChild('foundersModal') modalRef!: ElementRef<HTMLDialogElement>;

  openModal(e?: Event) {
    e?.preventDefault();
    const modal = this.modalRef.nativeElement;
    modal.showModal();                         // open
    document.documentElement.style.overflow = 'hidden'; // lock page scroll
    setTimeout(() => modal.querySelector<HTMLElement>('.modal__close')?.focus(), 0);
  }

  closeModal() {
    this.modalRef.nativeElement.close();
    document.documentElement.style.overflow = '';      // restore scroll
  }

  // Prevent closing via ESC (optional; keep if you want ESC disabled)
  @HostListener('cancel', ['$event'])
  onCancel(ev: Event) { ev.preventDefault(); }

  private observer?: IntersectionObserver;

  constructor(private router: Router) {}

  goHomeFragment(fragment: string) {
    console.log(fragment);
    this.router.navigate(['/home'], { fragment });
  }

  ngAfterViewInit(): void {
    // Highlight active tab while scrolling
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        // if (visible?.target?.id && visible.target.id !== this.active) {
        //   this.active = visible.target.id as typeof this.active;
        // }
      },
      {
        root: null,
        rootMargin: '-45% 0px -45% 0px', // consider the sticky header
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    this.sections.forEach((sec) =>
      this.observer!.observe(sec.nativeElement)
    );

    // If the page loads with #fragment, scroll there
    const fragment = window.location.hash?.replace('#', '');
    if (fragment) {
      setTimeout(() => this.scrollTo(fragment), 0);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  // Click handler from the menu
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;

    // Update active immediately so CSS highlights right away
    this.active = id as typeof this.active;

    // Update the URL without reloading
    this.router.navigate([], { fragment: id, replaceUrl: true });

    // Smooth scroll (section has scroll-margin to avoid being hidden)
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  studentPrograms = [
  {
    num: '01',
    title: '1st Year Students',
    desc:
      'Idea Generation & Validation<br>' +
      'Introductory workshops to spark creativity and explore problem-solving.',
    duration: '2 Days/Batch',
  },
  {
    num: '02',
    title: '2nd Year Students',
    desc:
      'Theory from Idea to Venture Creation<br>' +
      'Classroom sessions on business models, startup basics and innovation frameworks.',
    duration: '10 Days',
  },
  {
    num: '03',
    title: '3rd Year Students',
    desc:
      'Prototype Creation<br>' +
      'Hands-on labs and mentoring to build working prototypes and test solutions.',
    duration: '45 Days',
  },
  {
    num: '04',
    title: '4th Year Students',
    desc:
      'Design Thinking to Venture Creation<br>' +
      'Immersive incubation with real-world problem solving, product development, and go-to-market strategies.',
    duration: '3 Months',
  },
];

}