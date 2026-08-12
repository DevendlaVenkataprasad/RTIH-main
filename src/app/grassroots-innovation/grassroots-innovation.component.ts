import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';

@Component({
  selector: 'app-grassroots-innovation',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderRtihComponent,
    FooterRtihComponent,
  ],
  templateUrl: './grassroots-innovation.component.html',
  styleUrls: ['./grassroots-innovation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrassrootsInnovationComponent implements OnInit {
  flowSteps = [
    { icon: 'cottage', title: 'Problem in Village', color: 'green' },
    { icon: 'lightbulb', title: 'Grassroots Innovation', color: 'orange' },
    { icon: 'verified', title: 'Technology Validation', color: 'blue' },
    { icon: 'query_stats', title: 'Enterprise Creation', color: 'blue' },
    { icon: 'handshake', title: 'Market Linkage', color: 'blue' },
    { icon: 'groups', title: 'Sustainable Livelihoods', color: 'green' },
  ];

  mapLegend = [
    { color: '#1c75bc', name: 'Emani, Guntur District', status: '(Operational)' },
    { color: '#a32495', name: 'Pithapuram, Kakinada District', status: '(Operational)' },
    { color: '#e71e25', name: 'Kuppam, Chittoor District', status: '(Operational)' },
    { color: '#7aa85b', name: '13 District Technology Validation Centres', status: '(Coming Soon)' },
    { color: '#49536b', name: '175+ Rural Outposts', status: '(Planned)' },
  ];

  rsvcLocations = [
    {
      name: 'EMANI RSVC',
      district: 'Guntur District',
      focus: 'Focus: Agri-Tech, Food Processing, Renewable Energy',
      villages: 'Villages Covered: 30+',
      image: 'assets/grassroot/farms-of-the-future.jpg',
    },
    {
      name: 'PITHAPURAM RSVC',
      district: 'Kakinada District',
      focus: 'Focus: Agri Value Addition, Fisheries, Rural Enterprises',
      villages: 'Villages Covered: 30+',
      image: 'assets/grassroot/new-farm-technology.jpg',
    },
    {
      name: 'KUPPAM RSVC',
      district: 'Chittoor District',
      focus: 'Focus: Horticulture, Dairy, Rural Manufacturing',
      villages: 'Villages Covered: 25+',
      image: 'assets/grassroot/innovative-farming.jpg',
    },
  ];

  whatWeDoItems = [
    {
      icon: 'yard',
      accent: 'green',
      title: 'Rural Technology Deployment',
      points: ['RuTAG Technologies', 'Appropriate Tech', 'Climate Smart Tech', 'Renewable Energy'],
    },
    {
      icon: 'groups',
      accent: 'blue',
      title: 'Entrepreneurship Development',
      points: ['EDP & Training', 'Business Planning', 'Mentoring', 'Startup Readiness'],
    },
    {
      icon: 'lightbulb',
      accent: 'orange',
      title: 'Grassroots Innovation',
      points: ['Innovator Identification', 'Innovation Validation', 'Prototype Support', 'Patent Facilitation'],
    },
    {
      icon: 'school',
      accent: 'blue',
      title: 'Skill Development',
      points: ['Youth', 'Women', 'Farmers', 'SHGs, FPOs', 'Artisans'],
    },
    {
      icon: 'settings',
      accent: 'blue',
      title: 'Technology Demonstrations',
      points: ['Agri Technologies', 'Food Processing', 'Drones, IoT', 'Renewable Energy'],
    },
    {
      icon: 'shopping_cart',
      accent: 'blue',
      title: 'Market Linkages',
      points: ['Branding', 'Packaging', 'E-commerce', 'Buyer Seller Meets'],
    },
  ];

  programItems = [
    { icon: 'agriculture', color: '#f26b21', title: 'Rural Entrepreneurship Programme' },
    { icon: 'settings_input_component', color: '#f26b21', title: 'Technology Demonstration Camps' },
    { icon: 'travel_explore', color: '#3337c9', title: 'Innovation Discovery Camps' },
    { icon: 'emoji_objects', color: '#1494bf', title: 'Grassroots Innovation Fellowship' },
    { icon: 'diversity_1', color: '#0b812f', title: 'Rural Enterprise Fellowship' },
    { icon: 'support_agent', color: '#a7198e', title: 'Women Entrepreneurship Programme' },
    { icon: 'co_present', color: '#1b8a3c', title: 'Farmer Innovation Programme' },
    { icon: 'trending_up', color: '#1567c9', title: 'Student Rural Innovation Internship' },
    { icon: 'lightbulb', color: '#f26b21', title: 'Village Startup Bootcamp' },
    { icon: 'emoji_events', color: '#125698', title: 'Innovation Challenge / Hackathons' },
  ];

  technologyItems = [
    {
      title: 'Millet Processing Unit',
      subtitle: 'RuTAG / IIT',
      image: 'assets/grassroot/agritech.png',
      benefits: 'Value addition, higher income',
      cost: 'Cost: 2.5 Lakhs',
    },
    {
      title: 'Solar Dryer',
      subtitle: 'NIRDPR',
      image: 'assets/grassroot/seeding-agri-innovations.png',
      benefits: 'Reduces post harvest losses',
      cost: 'Cost: 1.2 Lakhs',
    },
    {
      title: 'Multi-Crop Thresher',
      subtitle: 'AP Innovation',
      image: 'assets/grassroot/farmer-image-on-tractor.jpg',
      benefits: 'Saves time and labour',
      cost: 'Cost: 1.8 Lakhs',
    },
    {
      title: 'Drone for Agriculture',
      subtitle: 'RTIH Hub',
      image: 'assets/grassroot/drons.jpg',
      benefits: 'Precision farming',
      cost: 'Cost: 4.5 Lakhs',
    },
  ];

  successStories = [
    {
      name: 'Lakshmi Devi',
      location: 'Emani, Guntur',
      income: 'Income increased 10,000 to 45,000 per month',
      image: 'assets/grassroot/farmer.webp',
    },
    {
      name: 'Ramesh Babu',
      location: 'Pithapuram, Kakinada',
      income: 'Income increased 8,000 to 25,000 per month',
      image: 'assets/grassroot/farmer-image-on-tractor.jpg',
    },
    {
      name: 'Saroja',
      location: 'Kuppam, Chittoor',
      income: 'Income increased 6,000 to 26,000 per month',
      image: 'assets/grassroot/leaf-tech.jpg',
    },
  ];

  partners = ['EDII', 'TATA STRIVE', 'BYST', 'NIRDPR', 'IITs RuTAG', 'SERP', 'NRLM', 'MSME', 'KVIC', 'Universities', 'Startup India', 'and more...'];

  upcomingEvents = [
    { date: '17', month: 'JAN', year: '2026', title: 'Rural Entrepreneurship Programme', location: 'Emani RSVC, Guntur' },
    { date: '25', month: 'JAN', year: '2026', title: 'Technology Demonstration Camp', location: 'Pithapuram RSVC, Kakinada' },
    { date: '05', month: 'FEB', year: '2026', title: 'Innovation Discovery Camp', location: 'Kuppam RSVC, Chittoor' },
    { date: '15', month: 'FEB', year: '2026', title: 'Exposure Visit to Successful Enterprises', location: 'Vizag - Amaravati Corridor' },
  ];

  resources = [
    { icon: 'assignment', title: 'Training Manuals' },
    { icon: 'description', title: 'Business Plans' },
    { icon: 'insert_chart', title: 'Project Reports' },
    { icon: 'smart_display', title: 'Videos' },
    { icon: 'calendar_month', title: 'Case Studies' },
    { icon: 'science', title: 'Govt. Schemes' },
    { icon: 'engineering', title: 'Technology Catalogues' },
    { icon: 'shopping_bag', title: 'Market Reports' },
  ];

  portalItems = [
    { icon: 'agriculture', title: 'Rural Entrepreneurship Programme' },
    { icon: 'precision_manufacturing', title: 'Technology Demonstration' },
    { icon: 'psychology', title: 'Innovation Challenge' },
    { icon: 'school', title: 'Fellowship Programmes' },
    { icon: 'work', title: 'Internship' },
    { icon: 'volunteer_activism', title: 'Volunteer' },
    { icon: 'rocket_launch', title: 'Startup Support' },
    { icon: 'person_add', title: 'Mentor Registration' },
    { icon: 'groups', title: 'Partner Registration' },
    { icon: 'developer_board', title: 'Technology Deployment' },
    { icon: 'storefront', title: 'RSVC Membership' },
    { icon: 'tour', title: 'Exposure Visit' },
    { icon: 'workspace_premium', title: 'Innovation Showcase' },
  ];

  impactStats = [
    { icon: 'home_work', color: '#125698', number: '175+', label: 'RSVCs (Planned)' },
    { icon: 'settings_suggest', color: '#4d3192', number: '26', label: 'Districts Covered' },
    { icon: 'groups', color: '#1c75bc', number: '20,000+', label: 'Beneficiaries Reached' },
    { icon: 'lightbulb', color: '#f26b21', number: '5,000+', label: 'Entrepreneurs Supported' },
    { icon: 'biotech', color: '#139976', number: '500+', label: 'Technologies Demonstrated' },
    { icon: 'emoji_objects', color: '#f26b21', number: '250+', label: 'Grassroots Innovations' },
    { icon: 'cottage', color: '#1b69c9', number: 'XXX Cr+', label: 'Enterprise Created' },
    { icon: 'diversity_3', color: '#62158b', number: 'XX+', label: 'Partner Organisations' },
  ];

  ctas = [
    {
      icon: 'emoji_objects',
      title: 'I am an Innovator',
      text: 'Share your innovation and get support',
      button: 'Register Now',
      image: 'assets/grassroot/grassroot-innovators-summit.jpg',
      background:
        'linear-gradient(90deg, rgba(42, 18, 72, .88), rgba(42, 18, 72, .52)), url(assets/grassroot/grassroot-innovators-summit.jpg)',
    },
    {
      icon: 'person_pin',
      title: 'I am an Entrepreneur',
      text: 'Start or grow your rural enterprise',
      button: 'Register Now',
      image: 'assets/grassroot/innovative-farming.jpg',
      background:
        'linear-gradient(90deg, rgba(42, 18, 72, .88), rgba(42, 18, 72, .52)), url(assets/grassroot/innovative-farming.jpg)',
    },
    {
      icon: 'precision_manufacturing',
      title: 'I am a Technology Provider',
      text: 'Deploy your technology in rural communities',
      button: 'Register Now',
      image: 'assets/grassroot/smart-farming.jpg',
      background:
        'linear-gradient(90deg, rgba(42, 18, 72, .88), rgba(42, 18, 72, .52)), url(assets/grassroot/smart-farming.jpg)',
    },
    {
      icon: 'diversity_2',
      title: 'I am an Organisation / Partner',
      text: 'Collaborate with RTIH for greater impact',
      button: 'Partner With Us',
      image: 'assets/grassroot/farms-of-the-future.jpg',
      background:
        'linear-gradient(90deg, rgba(42, 18, 72, .88), rgba(42, 18, 72, .52)), url(assets/grassroot/farms-of-the-future.jpg)',
    },
  ];

  ngOnInit() {}
}
