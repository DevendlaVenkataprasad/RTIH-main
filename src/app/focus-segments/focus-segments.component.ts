import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  NgZone
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

type Item = { title: string; desc: string };
type Tab  = { label: string; icon: string };

@Component({
  selector: 'app-focus-segments',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './focus-segments.component.html',
  styleUrls: ['./focus-segments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocusSegmentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewport', { static: false }) viewport?: ElementRef<HTMLDivElement>;

  /* tabs */
  tabs: Tab[] = [
    { label: 'Startups',               icon: 'assets/icons/startup-icon.svg' },
    { label: 'MSME’s',                 icon: 'assets/icons/tab2.svg' },
    { label: 'Rural Entrepreneurship', icon: 'assets/icons/tab3.svg' },
    { label: 'Innovators',             icon: 'assets/icons/tab4.svg' }
  ];
  active = 'Startups';

  /* carousel state */
  list: Item[] = [];
  cols = 4;                 // visible cards
  currentIndex = 0;         // leftmost visible (or active card in mobile)
  stepPx = 0;               // card width + gap (px)
  animating = true;

  private timer?: any;
  private ro?: ResizeObserver;
  private rafId: number | null = null;
  private lastScrollLeft = 0;
  private scrollTicking = false;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {}

  /* ---------- lifecycle ---------- */
  ngOnInit(): void {
    this.list = this.segments[this.active] ?? [];
  }

  // ngAfterViewInit(): void {
  //   this.scheduleMeasure();
  //   this.ro = new ResizeObserver(() => this.onResize());
  //   if (this.viewport) this.ro.observe(this.viewport.nativeElement);
  //   window.addEventListener('resize', this.onResize, { passive: true });
  // }

  ngAfterViewInit(): void {
  this.scheduleMeasure();
  this.ro = new ResizeObserver(() => {
    this.zone.run(() => this.onResize());   // <-- run in zone
  });
  if (this.viewport) this.ro.observe(this.viewport.nativeElement);

  // If you keep this, also wrap:
  window.addEventListener('resize', () => this.zone.run(this.onResize), { passive: true });
  this.cdr.detectChanges();
}


  ngOnDestroy(): void {
    this.pause();
    if (this.ro && this.viewport) this.ro.unobserve(this.viewport.nativeElement);
    window.removeEventListener('resize', this.onResize);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  /* ---------- UI actions ---------- */
  setActive(tab: string): void {
    if (this.active === tab) return;
    this.active = tab;
    this.list = this.segments[tab] ?? [];
    this.currentIndex = 0;
    this.scheduleMeasure();             // re-measure for the new list
  }

  next(): void {
    if (this.currentIndex < this.maxIndex) this.currentIndex++;
    else this.currentIndex = 0;
    this.cdr.markForCheck();
  }
  prev(): void {
    if (this.currentIndex > 0) this.currentIndex--;
    else this.currentIndex = this.maxIndex;
    this.cdr.markForCheck();
  }
  go(i: number): void {
    this.currentIndex = Math.min(Math.max(0, i), this.maxIndex);
    this.snapIfMobile();
    this.cdr.markForCheck();
  }

  play(): void {
  if (this.cols === 1) return;
  this.pause();
  this.timer = setInterval(() => {
    this.zone.run(() => {          // make it explicit
      if (this.dotsCount > 1) this.next();
    });
  }, 2500);
}


  pause(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = undefined; }
  }

  /* ---------- measurement & helpers ---------- */
  private onResize = () => {
    this.animating = false;
    const wasCols = this.cols;
    this.measureGeometry();
    this.clampIndex();

    // if switching into mobile snap mode, align scroll to the active card
    if (this.cols === 1 && wasCols !== 1) {
      this.pause(); // stop autoplay in mobile
      this.snapIfMobile();
    } else if (this.cols > 1 && wasCols === 1) {
      this.play();  // resume autoplay off mobile
    }

    // re-enable transition
    setTimeout(() => (this.animating = true));
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  };

  private clampIndex(): void {
    if (this.currentIndex > this.maxIndex) this.currentIndex = this.maxIndex;
  }

  /** Measure sizes safely after paint; retry until we get a non-zero width. */
  private scheduleMeasure(): void {
  if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  this.animating = false;

  const run = () => {
    const ok = this.measureGeometry();
    this.clampIndex();
    if (!ok) {
      this.rafId = requestAnimationFrame(run);
    } else {
      // re-enter zone so bindings update now
      this.zone.run(() => {
        this.animating = true;
        if (this.cols === 1) {
          this.pause();
          this.snapIfMobile(true);
        } else {
          this.play();
        }
        this.cdr.markForCheck();   // or this.cdr.detectChanges();
      });
    }
  };
  this.rafId = requestAnimationFrame(run);
}


  /** Returns true when measurement succeeded. */
  private measureGeometry(): boolean {
    const vp = this.viewport?.nativeElement;
    if (!vp) return false;

    const track = vp.querySelector<HTMLElement>('.track');
    const card  = vp.querySelector<HTMLElement>('.card');
    if (!track || !card) return false;

    const rect = card.getBoundingClientRect();
    if (rect.width === 0) return false;

    const gap = parseFloat(getComputedStyle(track).gap || '0');
    this.stepPx = rect.width + gap;

    const vpWidth = vp.getBoundingClientRect().width;
    // cols are driven by CSS, but we recompute here for logic
    this.cols = Math.max(1, Math.floor((vpWidth + gap) / this.stepPx));

    // push measured cols to CSS so cards size themselves correctly
    vp.style.setProperty('--cols', String(this.cols));
    return true;
  }

  private get maxIndex(): number {
    return Math.max(0, this.list.length - this.cols);
  }
  get dotsCount(): number { return this.maxIndex + 1; }
  get dots(): undefined[] { return Array(this.dotsCount).fill(undefined); }

  /* ---------- mobile scroll detection ---------- */

  /** Called from (scroll) on the viewport */
  onScroll(): void {
  const vp = this.viewport?.nativeElement;
  if (!vp || this.cols !== 1) return;

  if (!this.scrollTicking) {
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      // ⬇️ re-enter Angular for state change
      this.zone.run(() => {
        const idx = Math.round(vp.scrollLeft / this.stepPx);
        if (idx !== this.currentIndex) {
          this.currentIndex = Math.min(Math.max(0, idx), this.maxIndex);
          this.cdr.markForCheck(); // or detectChanges()
        }
        this.scrollTicking = false;
      });
    });
  }
}


  /** If in mobile mode, scroll to the active card boundary */
  private snapIfMobile(instant = false): void {
    if (this.cols !== 1) return;
    const vp = this.viewport?.nativeElement;
    if (!vp) return;

    const left = this.currentIndex * this.stepPx;
    vp.scrollTo({
      left,
      behavior: instant ? 'auto' : 'smooth'
    });
  }

  /* ---------- data ---------- */
  segments: Record<string, Item[]> = {
    'Startups': [
      { title: 'Startup Acceleration',       desc: 'Structured programs to refine business models and fast-track growth.' },
      { title: 'Mentorship & Strategy',      desc: 'Access to seasoned entrepreneurs, domain experts and business coaches.' },
      { title: 'Seed Funding & Investor Connect', desc: 'Support in raising capital through grants, angel networks, and VCs.' },
      { title: 'Co-working & Infrastructure', desc: 'Affordable workspace, labs, and shared resources for product development.' },
      { title: 'Legal & IP Assistance',      desc: 'Help with company incorporation, IP filing, and regulatory compliance.' },
      { title: 'Go-to-Market Support',       desc: 'Guidance on market entry, customer acquisition, and pilot deployments.' },
      { title: 'Pitch Platforms & Demo Days', desc: 'Opportunities to present to investors, corporates, and ecosystem enablers.' },
      { title: 'Networking & Partnerships',  desc: 'Connect with industry, academia, and government for strategic growth.' }
    ],
    "MSME’s": [
      { title: 'Single-Window Assistance',   desc: 'Easy access to government schemes, registrations, and services.' },
      { title: 'Business Setup & Compliance',desc: 'Help with Udyam registration, GST, and legal formalities.' },
      { title: 'Finance & Credit Linkages',  desc: 'Support in loan applications and financial literacy.' },
      { title: 'Market Access & Promotion',  desc: 'Connect with buyers, trade fairs, and digital platforms.' },
      { title: 'Skill Development',          desc: 'Training programs tailored to industry and entrepreneurial needs.' },
      { title: 'Technology & Innovation Support', desc: 'Guidance on tech adoption, R&D, and incubation.' },
      { title: 'Mentorship & Advisory',      desc: 'Expert advice to grow and sustain your business.' },
      { title: 'Grievance Redressal',        desc: 'Assistance in resolving issues with departments or banks.' }
    ],
    'Rural Entrepreneurship': [
      { title: 'Business Formalization',     desc: 'Help with registration, licensing, and compliance to unlock growth.' },
      { title: 'Mentoring',                  desc: 'Expert guidance to refine ideas, build strategy, and scale sustainably.' },
      { title: 'Market Access',              desc: 'Connect with buyers, platforms, and institutional partners to expand reach.' },
      { title: 'Packaging & Branding',       desc: 'Enhance product appeal with design, storytelling, and brand identity.' },
      { title: 'Social Impact Focus',        desc: 'Support for ventures solving local challenges in agri, health, and education.' },
      { title: 'Financial Literacy',         desc: 'Training on budgeting, credit, and digital payments for empowerment.' },
      { title: 'Tech Enablement',            desc: 'Introduce affordable tools and innovations to boost productivity.' }
    ],
    'Innovators': [
      { title: 'Idea to Prototype',          desc: 'Guidance to shape raw ideas into working models or MVPs.' },
      { title: 'Mentorship & Expert Advisory', desc: 'Access to domain experts, entrepreneurs, and technical mentors.' },
      { title: 'Funding & Grants',           desc: 'Support in securing seed funding, grants, and investor connections.' },
      { title: 'Co-working & Lab Access',    desc: 'Affordable workspace, labs, and tools to build and test innovations.' },
      { title: 'Business & IP Support',      desc: 'Help with company registration, IP filing, and legal compliance.' },
      { title: 'Market Validation & Pilots', desc: 'Opportunities to test solutions with real users and partners.' }
    ]
  };
}
