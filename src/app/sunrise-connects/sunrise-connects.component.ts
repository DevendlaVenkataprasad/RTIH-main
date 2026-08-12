import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MaterialModule } from '../shared/material.module';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
interface RegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  organization: FormControl<string | null>;
  remarks: FormControl<string | null>;
}
@Component({
  selector: 'app-sunrise-connects',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderRtihComponent,
    FooterRtihComponent
  ],
  templateUrl: './sunrise-connects.component.html',
  styleUrls: ['./sunrise-connects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SunriseConnectsComponent implements OnInit, OnDestroy {

registerForm!: FormGroup;
  submitted = false;
loading = false;
showForm = false;
readonly registrationFormUrl: SafeResourceUrl;
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {

    this.registrationFormUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://sunrise-connect.rtih.co.in/');
    
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      organization: ['', [Validators.required]],
      remarks: ['']
    });

  }

  ngOnInit(): void {
  }

  get f(): any {
    return this.registerForm.controls;
  }

   

onSubmit() {
  this.submitted = true;
  if (this.registerForm.invalid) return;

  this.loading = true;  // Show loading spinner

  const params = {
    name: this.registerForm.value.name,
    email: this.registerForm.value.email,
    phone: this.registerForm.value.phone,
    organization: this.registerForm.value.organization,
    remarks: this.registerForm.value.remarks
  };

  // First email (to you)
  emailjs.send('service_r2zgllf', 'template_cftu0up', params, 'kVk4bvJVzKwxZVVJr')
    .then(() => {
      // Second email (auto reply)
      return emailjs.send('service_r2zgllf', 'template_xd9ltlb', params, 'kVk4bvJVzKwxZVVJr');
    })
    .then(() => {
      this.loading = false;  // 🔥 Stop loading

      Swal.fire({
        title: "Success!",
        text: "Your form was submitted and a confirmation email has been sent.",
        icon: "success",
        confirmButtonColor: "#6C3CFF"
      });

      this.registerForm.reset();
      this.submitted = false;
    })
    .catch((err: any) => {
      this.loading = false;  // 🔥 Stop loading even on error

      Swal.fire({
        title: "Error!",
        text: "Email sending failed. Please try again later.",
        icon: "error",
        confirmButtonColor: "#ff4f4f"
      });

      console.error("EmailJS Error:", err);
    });
}
 openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  scrollToContribution() {
    const section = document.getElementById('pathways');
    if (!section) return;

    const headerOffset = 90;
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  tabs = [
  {
    name: 'Mentor Founders',
    icon: 'assets/icons/mentor-icon.svg',
    features: [
      { title: 'Guide Emerging Founders', text: 'Mentor early-stage entrepreneurs as they shape ideas, decisions, and venture direction.' },
      { title: 'Support Student Innovators', text: 'Help students move from curiosity and ideas toward practical innovation pathways.' },
      { title: 'Enable Structured Engagement', text: 'Contribute through focused mentoring sessions, reviews, and ecosystem interactions.' }
    ]
  },
  {
    name: 'Empowering Startups',
    icon: 'assets/icons/investor-icon.svg',
    features: [
      { title: 'Contribute Through Investment', text: 'Support promising ventures with capital, investor perspective, and growth readiness.' },
      { title: 'Offer Strategic Guidance', text: 'Help startups refine their business models, market choices, and scale-up decisions.' },
      { title: 'Share Venture-Building Insight', text: 'Bring practical experience from building, leading, or backing successful ventures.' }
    ]
  },
  {
    name: 'Enable Access',
    icon: 'assets/icons/enable-icon.svg',
    features: [
      { title: 'Open Pathways to Markets', text: 'Connect founders with market opportunities where they can test, sell, and scale.' },
      { title: 'Build Industry Connections', text: 'Create bridges with corporates, professionals, institutions, and sector networks.' },
      { title: 'Enable Technology and Opportunity Access', text: 'Help innovators reach useful technology, expertise, partnerships, and opportunities.' }
    ]
  },
  {
    name: 'Collaborate',
    icon: 'assets/icons/startup-icon.svg',
    features: [
      { title: 'Partner on innovation programs', text: 'Work with RTIH on practical programs that support entrepreneurship and innovation.' },
      { title: 'Support research initiatives', text: 'Bring domain knowledge, institutional linkages, and applied research collaboration.' },
      { title: 'Collaborate on labs and challenges', text: 'Engage with labs, challenges, and problem-led initiatives across the ecosystem.' }
    ]
  },
  {
    name: 'Build Skills',
    icon: 'assets/icons/build-icon.svg',
    features: [
      { title: 'Contribute to skilling', text: 'Support learning pathways that prepare students, founders, and professionals for growth.' },
      { title: 'Support workforce development', text: 'Help strengthen practical capabilities aligned with industry and innovation needs.' },
      { title: 'Build future-ready talent pipelines', text: 'Contribute to long-term talent development for Andhra Pradesh’s innovation economy.' }
    ]
  },
  {
    name: 'Strengthen Ecosystem',
    icon: 'assets/icons/hub-icon.svg',
    features: [
      { title: 'Engage universities and incubators', text: 'Collaborate with academic institutions and incubation partners internationally.' },
      { title: 'Work with startups and policymakers', text: 'Connect startup experience with ecosystem decisions, programs, and policy conversations.' },
      { title: 'Strengthen ecosystem infrastructure', text: 'Support the networks, platforms, and partnerships needed for sustained innovation.' }
    ]
  }
];


  activeTabIndex = 0;
  activeCardIndex = 0;
  intervalId: any;

  get contributionTabs() {
    const strengthen = this.tabs.find(tab => tab.name === 'Strengthen Ecosystem');

    return this.tabs
      .filter(tab => !['Collaborate', 'Build Skills', 'Strengthen Ecosystem'].includes(tab.name))
      .concat({
        name: 'Strengthen Ecosystem',
        icon: strengthen?.icon ?? 'assets/icons/hub-icon.svg',
        features: [
          { title: 'Innovation Partnerships', text: 'Partner with RTIH on programs, labs, challenges, and applied research initiatives.' },
          { title: 'Academic and Industry Networks', text: 'Engage universities, incubators, corporates, professionals, and sector partners.' },
          { title: 'Ecosystem Infrastructure', text: 'Support the platforms, policy conversations, and partnerships needed for sustained innovation.' }
        ]
      });
  }

  get activeFeatures() {
    return this.contributionTabs[this.activeTabIndex]?.features ?? [];
  }


  changeTab(index: number) {
    this.activeTabIndex = index;
    this.activeCardIndex = 0;
    this.cdr.markForCheck();
  }

  changeCard(index: number) {
    this.activeCardIndex = index;
    this.cdr.markForCheck();
  }

  startAutoAnimation() {
    this.intervalId = setInterval(() => {
      this.activeCardIndex = (this.activeCardIndex + 1) % this.activeFeatures.length;
      this.cdr.markForCheck();
    }, 3000);
  }

  restartAnimation() {
    clearInterval(this.intervalId);
    this.startAutoAnimation();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}

