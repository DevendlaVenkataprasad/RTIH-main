import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';

type Benefit = string;
type PartnerCard = {
  icon: string;          // asset path
  title: string;
  subtitle: string;
  blurb: string;
  benefits: Benefit[];   // exactly 6 lines (renders 2 columns of 3)
  joinNow: boolean;
  buttonText?: string;
  buttonLink?: string;
};

@Component({
  selector: 'app-partner-with-us',
  templateUrl: './partner-with-us.component.html',
  styleUrls: ['./partner-with-us.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
})
export class PartnerWithUsComponent {
  cards: PartnerCard[] = [
    {
      icon: 'assets/icons/mentors-icon.svg',
      title: 'Mentors',
      subtitle: 'Why Partner as a Mentor?',
      blurb: 'Mentors are the guiding force behind every successful startup. At RTIH, we invite experienced professionals, industry experts, and thought leaders to share their knowledge and insights with budding entrepreneurs.',
      benefits: [
        'Shape the next generation of innovators.','Share your expertise and create real impact.',
        'Network with a vibrant community of startups and industry leaders.'
      ],
      buttonText: 'Join Now',
      buttonLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfIHCyne5Gbfo7Wbhx-zsq6Rz4iCqDlCM72pfHx47oypYbhOQ/viewform?usp=sharing&ouid=110257595124980297744',
      joinNow: true
    },
    
    {
      icon: 'assets/icons/investors-icon.svg',
      title: 'Investors',
      subtitle: 'Why Partner as an Investor?',
      blurb: 'Fuel innovation by investing in high-potential startups. RTIH connects investors with curated, promising ventures across diverse sectors.',
      benefits: [
        'Access to a pipeline of innovative startups.',
        'Opportunities for strategic investments and collaborations.',
        'Be part of a growing entrepreneurial ecosystem.'
      ],
      joinNow: false
    },
    {
      icon: 'assets/icons/corporates-icon.svg',
      title: 'Corporates',
      subtitle: 'Why Partner as a Corporate?',
      blurb: 'Corporates are key drivers of innovation through collaboration and market access. Partner with RTIH to co-create solutions, explore new technologies, and engage with startups that align with your business goals.',
      benefits: [
        'Discover cutting-edge solutions for your business challenges.',
        'Build strategic alliances with startups and innovators.',
        'Strengthen your brand as an innovation leader.'
      ],
      joinNow: false
    },
    
    // {
    //   icon: 'assets/icons/acadamic-icon.svg',
    //   title: 'Academic Incubators',
    //   subtitle: 'Why Partner as an Academic Incubator?',
    //   blurb: 'Academic institutions are the cradle of innovation. RTIH collaborates with academic incubators to nurture student-led startups and foster research-driven entrepreneurship.',
    //   benefits: [
    //     'Provide your students access to advanced resources and networks.',
    //     'Co-develop programs that encourage innovation and entrepreneurship.',
    //     'Create pathways for research commercialization and startup growth.'
    //   ],
    //   joinNow: false
    // }

    {
      icon: 'assets/icons/acadamic-icon.svg',
      title: 'RTIH-Outposts',
      blurb: 'RTIH-Outposts are institutional partners within the RTIH statewide innovation network—enabling universities, colleges, and regional centres to deliver startup support locally, with shared access to mentors, investors, programs, and platforms aligned to the AP Innovation & Startup Policy 2024–29.',
      subtitle: 'Why Partner as an RTIH-Outpost?',
      benefits: [
        'Become part of Andhra Pradesh’s policy-aligned innovation ecosystem.',
        'Extend high-quality startup support to your region with statewide backing.',
        'Access shared mentors, investors, programs, and digital platforms.',
        'Build your incubation capacity and credibility',
        'Help local startups contribute to jobs and regional growth.'
      ],
      // buttonText: 'Explore More',
      buttonLink: 'RTIH-outpost-model',
      joinNow: true
    }

  ];
}
