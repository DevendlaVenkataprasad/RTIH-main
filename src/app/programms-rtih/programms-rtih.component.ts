import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { InnerBannerComponent } from '../inner-banner/inner-banner.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { Subscription } from 'rxjs';

type Step = 'exploration' | 'pre-incubation' | 'incubation' | 'acceleration' | 'innotribe' | 'avgc';

@Component({
  selector: 'app-about-rtih',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InnerBannerComponent,
    HeaderRtihComponent,
    FooterRtihComponent,
    RouterModule,
  ],
  templateUrl: './programms-rtih.component.html',
  styleUrls: ['./programms-rtih.component.scss'],
})
export class ProgrammsRtihComponent implements OnInit, AfterViewInit, OnDestroy
{
 
  active: Step = 'exploration';
  private fragmentSubscription?: Subscription;

  //@ViewChildren('progSection', { read: ElementRef }) sections!: QueryList<ElementRef<HTMLElement>>;
  //active: Step = 'exploration';

  @ViewChildren('progSection', { read: ElementRef })
  sections!: QueryList<ElementRef<HTMLElement>>;

  private headerOffset = 98 + 20; // header height + scroll margin buffer
  private ticking = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // initial sync (after view paints)
    setTimeout(() => this.updateActiveByScroll(), 0);

    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => {
      if (this.isProgramStep(fragment)) {
        setTimeout(() => this.scrollTo(fragment, true), 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.fragmentSubscription?.unsubscribe();
  }

  // Smooth scroll on click
  scrollTo(id: Step, skipUrlUpdate = false): void {
    this.active = id;
    if (!skipUrlUpdate) {
      this.router.navigate([], { fragment: id, replaceUrl: true });
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private isProgramStep(fragment: string | null): fragment is Step {
    return ['exploration', 'pre-incubation', 'incubation', 'acceleration', 'innotribe', 'avgc'].includes(fragment ?? '');
  }

  // Efficient scroll listener (throttled with rAF)
  @HostListener('window:scroll')
  onWinScroll() {
    if (this.ticking) return;
    this.ticking = true;

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.updateActiveByScroll();
        this.ticking = false;
      });
    });
  }

  @HostListener('window:resize')
  onWinResize() {
    this.updateActiveByScroll();
  }

  // Core: choose the section whose top is closest ABOVE a tracking line
  private updateActiveByScroll() {
    const els = (this.sections?.toArray() || []).map((r) => r.nativeElement);
    if (!els.length) return;

    // tracking line a bit below the header (¼ viewport down feels natural)
    const lineY = window.scrollY + this.headerOffset + window.innerHeight * 0.25;

    let current: HTMLElement = els[0];

    for (const el of els) {
      const top = el.offsetTop;
      if (top <= lineY) current = el; else break; // sections are in DOM order
    }

    const id = (current.id as Step) || 'exploration';

    if (id !== this.active) {
      // run inside Angular so bindings refresh
      this.zone.run(() => (this.active = id));
    }
  }

  goHomeFragment(fragment: string) {
    console.log(fragment);
    this.router.navigate(['/home'], { fragment });
  }

  goToInnotribe() {
    this.router.navigate(['/innotribe']);
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



}
