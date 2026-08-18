import { Component, OnInit } from '@angular/core';
import { HeaderRtihComponent } from "../header-rtih/header-rtih.component";
import { InnerBannerComponent } from "../inner-banner/inner-banner.component";
import { FooterRtihComponent } from "../footer-rtih/footer-rtih.component";
import { Router, RouterModule } from '@angular/router';
import { loadStylesheetOnce } from '../shared/load-stylesheet';

@Component({
  selector: 'app-ed-tech-innovation',
  standalone: true,
  templateUrl: './ed-tech-innovation.component.html',
  styleUrls: ['./ed-tech-innovation.component.css'],
  imports: [HeaderRtihComponent, InnerBannerComponent, FooterRtihComponent, RouterModule]
})
export class EdTechInnovationComponent implements OnInit {

constructor(private router: Router) { }

  ngOnInit() {
    loadStylesheetOnce('/icons.css');
    this.getTableData();
  }
  goHomeFragment(fragment: string) {
    this.router.navigate(['/healthtech-innovation-challenge-2025'], { fragment });
  }
  
getTableData() {
  const tableData = [
    {
      category: 'Startups (Early to Growth Stage)',
      description: 'Ed-Tech and SaaS startups developing scalable digital learning platforms or tools'
    },
    {
      category: 'Independent Innovators',
      description: 'Individual developers or innovators with a functional LMS prototype or solution'
    },
    {
      category: 'Academic & Research Institutions',
      description: 'Universities, research labs, and incubators working on digital education technologies'
    },
    {
      category: 'Technology Companies',
      description: 'Firms with existing LMS, SaaS, or learning platform solutions ready for customization'
    }
  ];

  const trackByCategory = (_: number, item: any) => item.category;
}

}

