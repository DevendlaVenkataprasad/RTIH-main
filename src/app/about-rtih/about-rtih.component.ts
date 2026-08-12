import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { InnerBannerComponent } from '../inner-banner/inner-banner.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { OurPartnerComponent } from '../our-partner/our-partner.component';
@Component({
  selector: 'app-about-rtih',
  standalone: true,
  imports: [CommonModule, MaterialModule, 
    ReactiveFormsModule, FormsModule, 
    InnerBannerComponent, HeaderRtihComponent, OurPartnerComponent, FooterRtihComponent],
  templateUrl: './about-rtih.component.html',
  styleUrls: ['./about-rtih.component.scss']
})
export class AboutRtihComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
