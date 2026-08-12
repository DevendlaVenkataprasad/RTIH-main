import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';

type District = { label: string; slug: string };

@Component({
  selector: 'app-header-rtih',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
  ],
  templateUrl: './header-rtih.component.html',
  styleUrls: ['./header-rtih.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderRtihComponent {
  districts: District[] = [
    { label: 'Amaravati Hub',      slug: 'amaravati' },
    { label: 'Ananthapuramu',      slug: 'anantapur' },
    { label: 'Rajamahendravaram',  slug: 'rajahmundry' },
    { label: 'Tirupati',           slug: 'tirupati' },
    { label: 'Vijayawada',         slug: 'vijayawada' },
    { label: 'Visakhapatnam',      slug: 'visakhapatnam' },
    
  ];

  constructor(private router: Router) {}

  goDistrict(slug: string) {
    this.router.navigate(['/location', slug]);
  }

  goHomeFragment(fragment: string) {
    this.router.navigate(['/home'], { fragment });
  }
  
}
