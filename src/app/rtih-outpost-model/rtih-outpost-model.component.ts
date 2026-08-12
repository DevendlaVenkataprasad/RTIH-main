import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { InnerBannerComponent } from '../inner-banner/inner-banner.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
@Component({
  selector: 'app-rtih-outpost-model',
  standalone: true,
  imports: [CommonModule, MaterialModule, 
    ReactiveFormsModule, FormsModule, 
    InnerBannerComponent, HeaderRtihComponent, FooterRtihComponent],
  templateUrl: './rtih-outpost-model.component.html',
  styleUrls: ['./rtih-outpost-model.component.scss']
})
export class RtihOutpostModelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
