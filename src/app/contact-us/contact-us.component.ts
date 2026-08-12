import { Component, OnInit } from '@angular/core';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { InnerBannerComponent } from '../inner-banner/inner-banner.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [HeaderRtihComponent, FooterRtihComponent, InnerBannerComponent],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
