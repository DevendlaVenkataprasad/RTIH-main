import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

@Component({
  selector: 'app-footer-rtih',
  templateUrl: './footer-rtih.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  styleUrls: ['./footer-rtih.component.scss'],
})
export class FooterRtihComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
