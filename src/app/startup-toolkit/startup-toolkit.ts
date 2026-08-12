import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

export type ToolkitLogo = {
  src: string;
  alt: string;
};

export type ToolkitCategory = {
  title: string;
  description: string;
  keyOfferings: string[];
  logos: ToolkitLogo[];
};

@Component({
  selector: 'app-startup-toolkit',
  imports: [CommonModule],
  templateUrl: './startup-toolkit.html',
  styleUrl: './startup-toolkit.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartupToolkit implements OnInit, OnChanges, OnDestroy {
  /**
   * Optional data fetched from the incubation PHP backend's
   * incubation-sections-feed.php ('toolkit' section). When provided (and
   * non-empty), it overrides the hardcoded `categories` below so the admin
   * portal can manage this page's content. If the backend is unreachable
   * or hasn't been deployed yet, this stays undefined and the hardcoded
   * defaults keep working exactly as before.
   */
  @Input() categoriesOverride?: ToolkitCategory[] | null;

  categories: ToolkitCategory[] = [
    {
      title: 'Legal Partners',
      description:
        'Legal helpdesk support helps startups stay compliant, protect IP, prepare contracts, manage tax and secretarial filings, and become investment-ready for future funding rounds.',
      keyOfferings: [
        'Legal templates and toolkits',
        'Legal consultations and paid-service discounts',
        'Compliance, contracts, tax, IP, FEMA, valuation and funding support',
      ],
      logos: [
        { src: 'assets/Startup-toolkit/Legal-partners/AS&A.png', alt: 'AS&A' },
        { src: 'assets/Startup-toolkit/Legal-partners/CA.png', alt: 'CA legal partner' },
        { src: 'assets/Startup-toolkit/Legal-partners/superna.png', alt: 'Superna' },
        { src: 'assets/Startup-toolkit/Legal-partners/raasta.png', alt: 'Raasta' },
        { src: 'assets/Startup-toolkit/Legal-partners/volks-phantom.png', alt: 'Volks Phantom' },
      ],
    },
    {
      title: 'Finance Partners',
      description:
        'Finance partners support payment collections, transaction management, portfolio planning, investor readiness, valuation guidance, and access to early-stage funding networks.',
      keyOfferings: [
        'Payment setup and transaction-fee benefits',
        'Financial planning and literacy programs',
        'Investor connects, valuation guidance and pitch readiness',
      ],
      logos: [
        { src: 'assets/Startup-toolkit/Finance-partners/f2Fintechlogo.png', alt: 'F2 Fintech' },
        { src: 'assets/Startup-toolkit/Finance-partners/PhonePe_Logo.png', alt: 'PhonePe' },
        { src: 'assets/Startup-toolkit/Finance-partners/ventures.webp', alt: 'Ventures finance partner' },
      ],
    },
    {
      title: 'Technology Partners',
      description:
        'Technology partners provide cloud credits, infrastructure, migration, modernization, managed cloud operations, security, and advisory support so startups can scale without heavy upfront cost.',
      keyOfferings: [
        'Cloud credits and post-credit infrastructure discounts',
        'Cloud strategy, migration and modernization',
        'Managed operations, security monitoring and cost governance',
      ],
      logos: [
        { src: 'assets/Startup-toolkit/Technology-partners/pi-data-center.png', alt: 'Pi Data Center' },
        { src: 'assets/Startup-toolkit/Technology-partners/rapyder.png', alt: 'Rapyder' },
      ],
    },
    {
      title: 'Marketing Partners',
      description:
        'Marketing partners help startups build outreach engines with CRM tools, WhatsApp automation, cloud calling, chatbots, analytics, global visibility, and access to startup networks.',
      keyOfferings: [
        'CRM, Zoho wallet credits and startup software access',
        'WhatsApp automation, cloud calling, chatbot flows and analytics',
        'Global startup visibility, funding programs and ecosystem exposure',
      ],
      logos: [
        { src: 'assets/Startup-toolkit/Marketing-partners/avasar.png', alt: 'Avasar' },
        { src: 'assets/Startup-toolkit/Marketing-partners/caller-desk.png', alt: 'CallerDesk' },
        { src: 'assets/Startup-toolkit/Marketing-partners/mrkting.jpeg', alt: 'MrkTing' },
        { src: 'assets/Startup-toolkit/Marketing-partners/zoho.png', alt: 'Zoho' },
      ],
    },
    {
      title: 'HR Partners',
      description:
        'HR partners support people operations through mentoring, learning resources, employee insurance, health benefits, payroll automation, attendance, and workforce management tools.',
      keyOfferings: [
        'Mentor sessions, virtual classes and learning resources',
        'Health and business insurance benefits',
        'HRMS, payroll, attendance and workforce tracking tools',
      ],
      logos: [
        { src: 'assets/Startup-toolkit/HR-partners/coreHRx.svg', alt: 'CoreHRx' },
        { src: 'assets/Startup-toolkit/HR-partners/plum_rebranded_logo.svg', alt: 'Plum' },
        { src: 'assets/Startup-toolkit/HR-partners/Wadhwani-Foundation-Logo.webp', alt: 'Wadhwani Foundation' },
      ],
    },
  ];

  activeCategoryIndex = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.applyCategoriesOverride();
    this.play();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriesOverride']) {
      this.applyCategoriesOverride();
      this.activeCategoryIndex = 0;
    }
  }

  ngOnDestroy(): void {
    this.pause();
  }

  private applyCategoriesOverride(): void {
    if (this.categoriesOverride && this.categoriesOverride.length > 0) {
      this.categories = this.categoriesOverride;
    }
  }

  get activeCategory(): ToolkitCategory {
    return this.categories[this.activeCategoryIndex];
  }

  selectCategory(index: number): void {
    this.activeCategoryIndex = index;
    this.play();
  }

  openJoinMail(event: MouseEvent): void {
    event.preventDefault();
    window.location.href = 'mailto:connect@rtih.co.in';
  }

  resolveAsset(path: string): string {
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }

    return `/${path.replace(/^\/+/, '')}`;
  }

  play(): void {
    this.pause();
    this.timer = setInterval(() => this.nextCategory(), 3500);
  }

  pause(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private nextCategory(): void {
    this.activeCategoryIndex = (this.activeCategoryIndex + 1) % this.categories.length;
    this.cdr.markForCheck();
  }
}
