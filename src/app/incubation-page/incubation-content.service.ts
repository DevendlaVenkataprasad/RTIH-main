import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

/**
 * Base URL for the PHP + MySQL incubation admin backend
 * (see /incubation-admin-backend at the repo root for the deliverable
 * that needs to be dropped into the existing admin portal's
 * `incubation/` department folder).
 *
 * IMPORTANT: this project does not currently have a src/environments
 * setup, so this constant is the single place to update once the PHP
 * backend is deployed (e.g. to Hostinger). Until then — or if a request
 * simply fails — every consumer of this service falls back to the
 * hardcoded defaults already in the Angular components, so the site
 * keeps working either way.
 *
 * Expected shape once deployed, e.g.:
 *   'https://rtih.co.in/rtih_admin/incubation'
 */
export const INCUBATION_API_BASE = 'https://admin.rtih.co.in/incubation';

/* =============================================================================
 * Feed response shapes (mirrors incubation-programs-feed.php /
 * incubation-sections-feed.php in incubation-admin-backend/)
 * ========================================================================== */

export type IncubationProgramFeedContent = {
  description?: string;
  fullDescription?: string;
  duration?: string;
  format?: string;
  location?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Program-specific "Apply Now" link override (falls back to the
   *  site-wide apply URL on the Angular side when unset). */
  applyUrl?: string;
  colors?: { primary?: string; secondary?: string; lightBg?: string; dark?: string };
  targetAudience?: string[];
  features?: { icon: string; title: string; description: string }[];
  learningOutcomes?: string[];
  applicationSteps?: { number: string; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  contacts?: { email?: string; phone?: string; address?: string };
  partners?: string[];
  programHighlights?: string[];
};

export type IncubationProgramFeedItem = {
  id: number;
  program_key: string;
  track_group: string;
  title: string;
  tagline: string | null;
  route_path: string | null;
  display_order: number;
  active: boolean;
  content: IncubationProgramFeedContent;
  updated_at?: string;
};

export type IncubationProgramsFeedResponse = {
  ok: boolean;
  programs?: IncubationProgramFeedItem[];
  error?: string;
};

export type IncubationHeroSection = {
  enabled?: boolean;
  headline?: string;
  subtitle?: string;
  cta_label?: string;
  cta_url?: string;
  video_src?: string;
};

export type IncubationBenefitItem = {
  title?: string;
  text?: string;
  imageSrc?: string;
  imageAlt?: string;
  route?: string;
};

export type IncubationBenefitsSection = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  items?: IncubationBenefitItem[];
};

export type IncubationFaqItem = {
  question?: string;
  answer?: string;
};

export type IncubationMainFaqSection = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  items?: IncubationFaqItem[];
};

export type IncubationToolkitLogo = {
  src?: string;
  alt?: string;
};

export type IncubationToolkitCategory = {
  title?: string;
  description?: string;
  keyOfferings?: string[];
  logos?: IncubationToolkitLogo[];
};

export type IncubationToolkitSection = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  items?: IncubationToolkitCategory[];
};

export type IncubationGallerySlide = {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type IncubationGallerySection = {
  enabled?: boolean;
  items?: IncubationGallerySlide[];
};

export type IncubationSectionsFeedResponse = {
  ok: boolean;
  sections?: {
    hero?: IncubationHeroSection;
    benefits?: IncubationBenefitsSection;
    main_faq?: IncubationMainFaqSection;
    toolkit?: IncubationToolkitSection;
    gallery?: IncubationGallerySection;
  };
  error?: string;
};

@Injectable({ providedIn: 'root' })
export class IncubationContentService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches active incubation programs from the PHP backend.
   * Resolves to `null` (never throws) if the backend is unreachable, not
   * yet deployed, or returns an error — callers should keep their
   * hardcoded defaults in that case.
   */
  fetchPrograms(): Observable<IncubationProgramFeedItem[] | null> {
    return this.http.get<IncubationProgramsFeedResponse>(`${INCUBATION_API_BASE}/incubation-programs-feed.php`).pipe(
      map((response) => (response && response.ok && Array.isArray(response.programs) ? response.programs : null)),
      catchError(() => of(null)),
    );
  }

  /**
   * Fetches the hero/benefits/main_faq/toolkit/gallery landing sections from
   * the PHP backend. Resolves to `null` (never throws) on any failure.
   */
  fetchSections(): Observable<IncubationSectionsFeedResponse['sections'] | null> {
    return this.http.get<IncubationSectionsFeedResponse>(`${INCUBATION_API_BASE}/incubation-sections-feed.php`).pipe(
      map((response) => (response && response.ok && response.sections ? response.sections : null)),
      catchError(() => of(null)),
    );
  }
}
