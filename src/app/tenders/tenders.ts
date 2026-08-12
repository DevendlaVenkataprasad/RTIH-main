import { Component } from '@angular/core';
import { HeaderRtihComponent } from "../header-rtih/header-rtih.component";
import { InnerBannerComponent } from "../inner-banner/inner-banner.component";
import { FooterRtihComponent } from "../footer-rtih/footer-rtih.component";

@Component({
  selector: 'app-tenders',
  imports: [HeaderRtihComponent, InnerBannerComponent, FooterRtihComponent],
  templateUrl: './tenders.html',
  styleUrl: './tenders.scss'
})
export class Tenders {

}
