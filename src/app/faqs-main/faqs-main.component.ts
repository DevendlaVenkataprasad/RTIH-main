import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';

@Component({
  selector: 'app-faqs-main',
  templateUrl: './faqs-main.component.html',
   standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule,HeaderRtihComponent,FooterRtihComponent],
  styleUrls: ['./faqs-main.component.scss']
})
export class FaqsMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
faqs = [
  {
    q: '1. What is Ratan Tata Innovation Hub (RTIH)?',
    a: `RTIH is a state-wide initiative set up by the Government of Andhra Pradesh 
    to promote innovation, entrepreneurship, 
    and industry–academia collaboration. It acts as a central 
    point of support for startups and innovators.`,
    expanded: true
  },
  {
    q: '2. What is the vision behind establishing the Ratan Tata Innovation Hub (RTIH)?',
    a: `The RTIH was established to nurture grassroots innovation, empower entrepreneurs, 
    and create a vibrant startup ecosystem in Andhra Pradesh, with a vision to enable “One FamilyOne Entrepreneur” 
    and honor Ratan Tata’s legacy of innovation and social responsibility.`,
    expanded: false
  },
  {
    q: '3. Where is RTIH located?',
    a: `The central hub is set up at Amaravati, with Spokes in Vijayawada, Visakhapatnam, Tirupati, Anantapuram, 
    and Rajamahendravaram, collectively extending innovation support to all corners of the state.`,
    expanded: false
  },
  {
    q: '4. Who can apply for RTIH support?',
    a: `Startups, entrepreneurs, MSMEs, students, grassroots innovators, 
    women, differently abled and minority entrepreneurs, corporate partners, 
    and academic institutions are eligible to apply for support under the Ratan Tata Innovation Hub.`,
    expanded: false
  },
  {
    q: '5. How do I apply for RTIH programs?',
    a: `You can fill out the online application form available on the RTIH website or 
    by directly walking in to designated RTIH hubs or spokes and submitting their 
    application in person. Shortlisted applicants will be contacted for the next steps.`,
    expanded: false
  },
  {
    q: '6. Does RTIH charge for its services?',
    a: `RTIH offers many foundational services free of cost, including startup events, 
    mentoring, awareness sessions, and networking opportunities. However, certain advanced 
    services— such as access to labs, co-working spaces, event venues, 
    conference halls, and curated startup programs. Pricing varies by program and usage.`,
    expanded: false
  },
  {
    q: '7. What kind of help can startups expect?',
    a: `RTIH provides startups with incubation space, mentoring, outreach programs, 
    networking opportunities, and connections to investor and corporate networks. 
    It also assists startups in applying for 
    government schemes and incentives, though it does not directly offer financial support.`,
    expanded: false
  },
  {
    q: '8. Can startups outside Andhra Pradesh apply?',
    a: `Yes, they can engage with RTIH for incubation, acceleration,     
    and ecosystem programs, but they cannot claim state incentives.`,
    expanded: false
  },
  {
    q: '9. Does RTIH connect startups with funding opportunities?',
    a: `Yes, RTIH facilitates access to investors, venture capital, 
    and state or central government funding programs based 
    on the eligibility and requirements of the startups.`,
    expanded: false
  },
  {
    q: '10. How can I stay updated on RTIH activities?',
    a: `Follow our official Website and Social media handles 
    for the latest updates on programs, events, and opportunities.`,
    expanded: false
  }
];
}
