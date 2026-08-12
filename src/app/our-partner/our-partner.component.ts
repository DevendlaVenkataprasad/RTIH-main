import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';

type Logo = { src: string; alt: string };

@Component({
  selector: 'app-our-partner',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './our-partner.component.html',
  styleUrls: ['./our-partner.component.scss'],
})
export class OurPartnerComponent implements OnInit, AfterViewInit, OnDestroy {
  // Data ----------------------------------------------------------------------
  corporate: Logo[] = [
    { src: 'assets/Corporate-Partners/tata.png', alt: 'tata' },
    { src: 'assets/Corporate-Partners/adani.png', alt: 'adani' },
    { src: 'assets/Corporate-Partners/amaraja.png', alt: 'amaraja' },
    { src: 'assets/Corporate-Partners/amns-india.png', alt: 'amns-india' },
    { src: 'assets/Corporate-Partners/avanthi-feeds.png', alt: 'avanthi-feeds' },
    { src: 'assets/Corporate-Partners/bharat-forge.png', alt: 'bharat-forge' },
    { src: 'assets/Corporate-Partners/gail.png', alt: 'gail' },
    { src: 'assets/Corporate-Partners/gmr.png', alt: 'gmr' },
    { src: 'assets/Corporate-Partners/greenco.png', alt: 'greenco' },
    { src: 'assets/Corporate-Partners/jsw.png', alt: 'jsw' },
    { src: 'assets/Corporate-Partners/kia.png', alt: 'kia' },
    { src: 'assets/Corporate-Partners/l-t.png', alt: 'l-t' },
    { src: 'assets/Corporate-Partners/meil.png', alt: 'meil' },
    { src: 'assets/Corporate-Partners/mohan-spintex.png', alt: 'mohan-spintex' },
    { src: 'assets/Corporate-Partners/navyuga.png', alt: 'navyuga' },
    { src: 'assets/Corporate-Partners/nsl-group.png', alt: 'nsl-group' },
    { src: 'assets/Corporate-Partners/ongc.png', alt: 'ongc' },
    { src: 'assets/Corporate-Partners/raymond.png', alt: 'raymond' },
  ];

  knowledge: Logo[] = [
    { src: 'assets/Knoweldge-partners/andhra-university.png', alt: 'andhra-university' },
    { src: 'assets/Knoweldge-partners/bits-pilani.png', alt: 'bits-pilani' },
    { src: 'assets/Knoweldge-partners/central-university.png', alt: 'central-university' },
    { src: 'assets/Knoweldge-partners/gitam.png', alt: 'gitam' },
    { src: 'assets/Knoweldge-partners/iim-vizag.png', alt: 'iim-vizag' },
    { src: 'assets/Knoweldge-partners/iipe-vizag.png', alt: 'iipe-vizag' },
    { src: 'assets/Knoweldge-partners/iit-chennai.png', alt: 'iit-chennai' },
    { src: 'assets/Knoweldge-partners/iit-tirupathi.png', alt: 'iit-tirupathi' },
    { src: 'assets/Knoweldge-partners/jntu-ananthapur.png', alt: 'jntu-ananthapur' },
    { src: 'assets/Knoweldge-partners/jntu-kakinada.png', alt: 'jntu-kakinada' },
    { src: 'assets/Knoweldge-partners/nit-tadepalli.png', alt: 'nit-tadepalli' },
    { src: 'assets/Knoweldge-partners/srm-amaravathi.png', alt: 'srm-amaravathi' },
    { src: 'assets/Knoweldge-partners/srm-chennai.png', alt: 'srm-chennai' },
    { src: 'assets/Knoweldge-partners/vit-amaravathi.png', alt: 'vit-amaravathi' },
    { src: 'assets/Knoweldge-partners/vit-vellore.png', alt: 'vit-vellore' },
  ];

  // View references ------------------------------------------------------------
  @ViewChild('corpViewport', { static: false })
  corpViewport?: ElementRef<HTMLDivElement>;
  @ViewChild('knViewport', { static: false })
  knViewport?: ElementRef<HTMLDivElement>;

  // Per-carousel state ---------------------------------------------------------
  corpIdx = 0;
  corpCols = 5;

  knIdx = 0;
  knCols = 5;

  // Shared controls state ------------------------------------------------------
  sharedPages = 0;
  currentSharedPage = 0;

  animating = true;
  private timer?: any;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.recomputeCols();
    this.computeSharedPages();
    window.addEventListener('resize', this.onResize, { passive: true });
    this.play();
  }

  ngOnDestroy(): void {
    this.pause();
    window.removeEventListener('resize', this.onResize);
  }

  // ---------- Per-row arrows with wrap-around ----------
  private maxStart(total: number, cols: number) {
    return Math.max(0, total - cols);
  }

  nextCorp() {
    const max = this.maxStart(this.corporate.length, this.corpCols);
    this.corpIdx = this.corpIdx >= max ? 0 : this.corpIdx + 1;
    this.currentSharedPage = Math.min(this.corpIdx, this.sharedPages - 1);
  }

  prevCorp() {
    const max = this.maxStart(this.corporate.length, this.corpCols);
    this.corpIdx = this.corpIdx <= 0 ? max : this.corpIdx - 1;
    this.currentSharedPage = Math.min(this.corpIdx, this.sharedPages - 1);
  }

  nextKn() {
    const max = this.maxStart(this.knowledge.length, this.knCols);
    this.knIdx = this.knIdx >= max ? 0 : this.knIdx + 1;
    this.currentSharedPage = Math.min(this.knIdx, this.sharedPages - 1);
  }

  prevKn() {
    const max = this.maxStart(this.knowledge.length, this.knCols);
    this.knIdx = this.knIdx <= 0 ? max : this.knIdx - 1;
    this.currentSharedPage = Math.min(this.knIdx, this.sharedPages - 1);
  }

  // ---------- Shared controls (dots & autoplay) ----------
  nextAll() {
    this.currentSharedPage = (this.currentSharedPage + 1) % this.sharedPages;
    this.goToAll(this.currentSharedPage);
  }

  prevAll() {
    this.currentSharedPage =
      this.currentSharedPage <= 0 ? this.sharedPages - 1 : this.currentSharedPage - 1;
    this.goToAll(this.currentSharedPage);
  }

  goToAll(page: number) {
    // Clamp to each carousel’s max start index
    this.corpIdx = Math.min(page, this.maxStart(this.corporate.length, this.corpCols));
    this.knIdx   = Math.min(page, this.maxStart(this.knowledge.length, this.knCols));
    this.currentSharedPage = page;
  }

  play() {
    this.pause();
    this.timer = setInterval(() => this.nextAll(), 3000);
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
  }

  // ---------- Layout helpers --------------
  transform(idx: number, cols: number) {
    const percent = (idx * 100) / cols; // move by one tile
    return `translateX(-${percent}%)`;
  }

  private onResize = () => {
    const prevCorpCols = this.corpCols;
    const prevKnCols = this.knCols;
    this.recomputeCols();

    // reset index if layout changed to avoid blank
    if (prevCorpCols !== this.corpCols) this.corpIdx = 0;
    if (prevKnCols !== this.knCols) this.knIdx = 0;

    this.computeSharedPages();
    this.currentSharedPage = 0;
  };

  private recomputeCols() {
    this.corpCols = this.computeCols(this.measure(this.corpViewport));
    this.knCols   = this.computeCols(this.measure(this.knViewport));
  }

  private measure(ref?: ElementRef<HTMLDivElement>): number {
    return ref?.nativeElement.getBoundingClientRect().width || window.innerWidth;
  }

  private computeCols(w: number): number {
    if (w >= 1180) return 5; // desktop
    if (w >= 960)  return 5; // large tablet
    if (w >= 720)  return 3; // tablet
    if (w >= 520)  return 2; // phablet
    return 1;                // phone
  }

  private computeSharedPages() {
    const corpPages = this.pagesCount(this.corporate.length, this.corpCols);
    const knPages   = this.pagesCount(this.knowledge.length, this.knCols);
    this.sharedPages = Math.max(corpPages, knPages);
  }

  pagesCount(total: number, cols: number): number {
    // number of possible starting positions when you slide by 1 each time
    return Math.max(1, total - cols + 1);
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
