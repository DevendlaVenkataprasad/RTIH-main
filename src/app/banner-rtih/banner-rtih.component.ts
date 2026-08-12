import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

@Component({
  selector: 'app-banner-rtih',
  templateUrl: './banner-rtih.component.html',
  styleUrls: ['./banner-rtih.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
})
export class BannerRtihComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
