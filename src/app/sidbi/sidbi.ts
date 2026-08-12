import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';

type FundingOpportunity = {
  title: string;
  ticket: string;
  description: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
};

type SupportStep = {
  number: string;
  title: string;
  description: string;
};

@Component({
  selector: 'app-sidbi',
  standalone: true,
  imports: [CommonModule, HeaderRtihComponent, FooterRtihComponent],
  templateUrl: './sidbi.html',
  styleUrls: ['./sidbi.scss'],
})
export class Sidbi implements AfterViewInit, OnDestroy {
  @ViewChild('supportSection') private supportSectionRef?: ElementRef<HTMLElement>;

  readonly flagshipStats = [
    { value: '₹10L - ₹1Cr', label: 'Indicative ticket size' },
    { value: 'RTIH + SIDBI', label: 'Institutional support' },
    { value: 'Incubated startups', label: 'Primary fit' },
    { value: 'Capital readiness', label: 'Review focus' },
  ];

  readonly fundingOpportunities: FundingOpportunity[] = [
    {
      title: 'RTIH-SIDBI Seed Fund Program',
      ticket: '₹10L - ₹1Cr',
      description:
        'Best for RTIH incubated startups moving from product validation to early scale. Designed to help promising teams unlock capital for product development, market launch readiness, pilot execution, and operational acceleration.',
      href: 'mailto:connect@rtih.co.in?subject=RTIH-SIDBI%20Seed%20Fund%20Program',
      ctaLabel: 'Learn More',
    },
    {
      title: 'Startup India Seed Fund Scheme',
      ticket: 'Via eligible incubators',
      description:
        'Useful for idea-stage and prototype-stage startups seeking validation, proof of concept, or early market entry support. A national support pathway surfaced on the Startup India portal.',
      href: 'https://seedfund.startupindia.gov.in/',
      ctaLabel: 'Visit official page',
      external: true,
    },
    {
      title: 'Startup India Investor Connect',
      ticket: 'Investor matching and visibility',
      description:
        'Strong for startups preparing for fundraising conversations, introductions, and capital discovery. Helps founders improve discoverability and connect with a broader investor ecosystem.',
      href: 'https://investorconnect.startupindia.gov.in/',
      ctaLabel: 'Visit official page',
      external: true,
    },
    {
      title: 'Credit Guarantee Scheme for Startups',
      ticket: 'Debt access support',
      description:
        'Relevant for startups exploring debt pathways instead of only equity or grant capital. Useful when founders need a stronger bridge into institutional debt conversations.',
      href: 'https://www.startupindia.gov.in/',
      ctaLabel: 'Visit official page',
      external: true,
    },
  ];

  readonly supportSteps: SupportStep[] = [
    {
      number: '1',
      title: 'Capital Mapping',
      description:
        'We help founders understand whether grant, seed, debt, investor connect, or blended capital is the right first move.',
    },
    {
      number: '2',
      title: 'Readiness Review',
      description:
        'Teams sharpen decks, milestones, use of funds, market proof, and documentation before they enter formal funding discussions.',
    },
    {
      number: '3',
      title: 'Program Match',
      description:
        'Startups are aligned to the most sensible pathways based on stage, traction, compliance readiness, and sector context.',
    },
    {
      number: '4',
      title: 'Follow-through Support',
      description:
        'RTIH continues to support conversations, partner introductions, and next-step guidance after the first funding interaction.',
    },
  ];

  readonly leftSupportSteps = this.supportSteps.slice(0, 2);
  readonly rightSupportSteps = this.supportSteps.slice(2, 4);

  supportSectionVisible = false;
  private supportSectionObserver?: IntersectionObserver;

  resolveAsset(path: string): string {
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }

    return `/${path.replace(/^\/+/, '')}`;
  }

  ngAfterViewInit(): void {
    const section = this.supportSectionRef?.nativeElement;

    if (!section || typeof IntersectionObserver === 'undefined') {
      this.supportSectionVisible = true;
      return;
    }

    this.supportSectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.supportSectionVisible = true;
            this.supportSectionObserver?.disconnect();
            this.supportSectionObserver = undefined;
            break;
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    this.supportSectionObserver.observe(section);
  }

  ngOnDestroy(): void {
    this.supportSectionObserver?.disconnect();
  }
}
