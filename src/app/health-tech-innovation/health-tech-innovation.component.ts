import { Component, OnInit } from '@angular/core';
import { HeaderRtihComponent } from "../header-rtih/header-rtih.component";
import { InnerBannerComponent } from "../inner-banner/inner-banner.component";
import { FooterRtihComponent } from "../footer-rtih/footer-rtih.component";
import { Router, RouterModule } from '@angular/router';
import { loadStylesheetOnce } from '../shared/load-stylesheet';

@Component({
  selector: 'app-health-tech-innovation',
  standalone: true,
  templateUrl: './health-tech-innovation.component.html',
  styleUrls: ['./health-tech-innovation.component.scss'],
  imports: [HeaderRtihComponent, InnerBannerComponent, FooterRtihComponent, RouterModule]
})
export class HealthTechInnovationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    loadStylesheetOnce('/icons.css');
  }
  goHomeFragment(fragment: string) {
    this.router.navigate(['/healthtech-innovation-challenge-2025'], { fragment });
  }
}
