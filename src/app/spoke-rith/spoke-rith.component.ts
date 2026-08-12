import {
  Component,
  OnInit,
  OnDestroy,
  computed,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FooterRtihComponent } from '../footer-rtih/footer-rtih.component';
import { HeaderRtihComponent } from '../header-rtih/header-rtih.component';
import { Subscription } from 'rxjs';

// ---------- TYPE DEFINITIONS ----------
import { MatDialog } from '@angular/material/dialog';
import { VideoPopupComponent } from '../shared/video-popup/video-popup.component';
type Photo = { src: string; alt: string };
type Feature = { text: string };
type Sector = { icon: string; label: string };
type ServiceItem = { title: string; image?: string; icon?: boolean };

export type TeamMember = {
  name: string;
  role: string;
  email: string;
  phone: string;
  photo?: string;
  linkedin?: string;
};

type SpokeSections = {
  title: string;
  subtitle: string;
  heroSub: string;
  heroImg: string;
  photo: string;
  about: string[];
  mission: string;
  region: string;
  videoUrl: string;

  leadership?: { title?: string; members: TeamMember[] };
  facilities?: { title?: string; blurb: string; photos: Photo[]; features: Feature[] };
  sectors?: { title?: string; items: Sector[] };
  services?: { title?: string; items: ServiceItem[] };
  partnerships?: { title?: string; blurb: string };
  applyLink?: string;
  contactLink?: string;
  applyHref?: string;
  contactHref?: string;
};

// ---------- COMPONENT ----------
@Component({
  selector: 'app-spoke-rith',
  standalone: true,
  imports: [CommonModule, HeaderRtihComponent, FooterRtihComponent, RouterLink],
  templateUrl: './spoke-rith.component.html',
  styleUrls: ['./spoke-rith.component.scss']
})
export class SpokeRithComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sub?: Subscription;

  constructor(private router: Router, private dialog: MatDialog ) {}
openVideo(url: string) {
  this.dialog.open(VideoPopupComponent, {
    width: '900px',
    height: '400px',
    data: { url }
  });
}
  // goHomeFragment(fragment: string) {
  //   console.log(fragment);
  //   this.router.navigate(['/home'], { fragment });
  // }

  async goHomeFragment(fragment: string) {
  const base = this.router.url.split('#')[0];
  await this.router.navigate(
    base === '/home' ? [] : ['/home'],
    { fragment, queryParamsHandling: 'preserve' }
  );

  const deadline = performance.now() + 1500; // retry up to 1.5s to beat layout shifts
  const tick = () => {
    const el = document.getElementById(fragment);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    } else if (performance.now() < deadline) {
      setTimeout(tick, 50);
    }
  };
  requestAnimationFrame(tick);
}


  // ✅ Reactive signal for current slug
  slug = signal<string>('vijayawada');

  // ---------- DATA SOURCE ----------
  private content: Record<string, SpokeSections> = {
    vijayawada: {
      title: 'RTIH Vijayawada Spoke',
      subtitle: 'Vijayawada',
      videoUrl: 'https://youtu.be/5ssJZ0faBOQ',
      heroSub:
        'Driving Innovation and Entrepreneurship In The Vijayawada Region, Connecting Local Talent With Global Opportunities Through Comprehensive Startup Support And Incubation Programs.',
      heroImg: 'assets/spokes/spoke-banner.png',
      photo: 'assets/spokes/vjwd.jpg',
      about: [
        'RTIH Vijayawada is one of the prominent spokes of the Ratan Tata Innovation Hub (RTIH), dedicated to nurturing innovation and entrepreneurship across Andhra Pradesh.',
        'Located at Enikepadu, the center serves as a vibrant platform for startups, innovators, and MSMEs by providing access to infrastructure, mentorship, and industry partnerships.',
        'With a strong leadership team and sectoral focus, the spoke aims to transform ideas into impactful enterprises, strengthening the local and regional startup ecosystem.'
      ],
      mission:
        'Guided by RTIH’s vision, RTIH Vijayawada is committed to empowering innovators to become job creators rather than job seekers. The spoke envisions itself as a catalyst for sustainable growth, driving innovation-led entrepreneurship in the region.',
      region:
        'Vijayawada, known as the commercial capital of Andhra Pradesh, offers excellent connectivity, a strong industrial base, and proximity to educational institutions. The region has significant opportunities in IT services, manufacturing, logistics, and food processing, making it a fertile ground for innovative startups.',
      // leadership: {
      //   title: 'Leadership & Team',
      //   members: [
      //     { name: 'G. Krishnan', role: 'CEO', email: 'nittgk@gmail.com', phone: '+91 96776 82106', photo: 'assets/spokes/leader-photo.svg' },
      //     { name: 'D. Ravi Teja', role: 'Head Incubation', email: 'donepudiraviteja@gmail.com', phone: '+91 79934 20011', photo: 'assets/spokes/leader-photo.svg' },
      //     { name: 'Nandan', role: 'Head Partnerships', email: 'tandi30@gmail.com', phone: '+91 98616 65777', photo: 'assets/spokes/leader-photo.svg' },
      //     { name: 'Hima Bindu K', role: 'Head Finance', email: 'khbindu.ca@gmail.com', phone: '+91 90300 23996', photo: 'assets/spokes/leader-photo.svg' }
      //   ]
      // },
      facilities: {
        title: 'Infrastructure & Facilities',
        blurb: 'The spoke is housed in a modern facility at Sonovision Building, 4th Floor, Enikepadu, Vijayawada. It provides',
        photos: [
          { src: 'assets/spokes/fa-1.jpg', alt: 'Office workspace' },
          { src: 'assets/spokes/fa-2.jpg', alt: 'Open office area' },
          { src: 'assets/spokes/fa-3.jpg', alt: 'Meeting room' },
          { src: 'assets/spokes/fa-4.jpg', alt: 'Board room' },
          { src: 'assets/spokes/fa-5.jpg', alt: 'Private cabin' },
          { src: 'assets/spokes/fa-6.jpg', alt: 'Training hall' },
          { src: 'assets/spokes/fa-7.jpg', alt: 'Mentorship wall' },
          { src: 'assets/spokes/fa-8.jpg', alt: 'Startup branding' }
        ],
        features: [
          { text: 'Co-working spaces and private offices' },
          { text: 'Meeting and conference rooms' },
          { text: 'Access to mentorship and networking sessions' },
          { text: 'Facilities for training and startup events' }
        ]
      },
      sectors: {
        title: 'Focus Sectors',
        items: [
          { icon: 'assets/spokes/bza-iot.svg', label: 'Industrial IoT' },
          { icon: 'assets/spokes/bza-agri.svg', label: 'Agri Technology' },
          { icon: 'assets/spokes/bza-auto.svg', label: 'Auto-Body Building/Light Engineering' },
          { icon: 'assets/spokes/bza-construction.svg', label: 'Construction Technology' }
        ]
      },
      services: {
        title: 'Programs & Services',
        items: [
          { title: 'Incubation & Acceleration Programs', image: 'assets/spokes/s1.jpg', icon: true },
          { title: 'Mentorship from industry experts and academia', image: 'assets/spokes/s2.jpg' },
          { title: 'Investor & funding linkages', image: 'assets/spokes/s3.jpg' },
          { title: 'Partnership opportunities with corporates and government agencies', image: 'assets/spokes/s4.jpg' },
          { title: 'Capacity building workshops and training sessions', image: 'assets/spokes/s5.jpg' }
        ]
      },
      partnerships: {
        title: 'Partnerships & Collaborations',
        blurb: `RTIH Vijayawada collaborates closely with academic institutions, industry leaders, and
        government bodies to strengthen the innovation ecosystem.`
      },
      applyLink: '/apply',
      contactLink: '/contact'
    },
       amaravati: {
      title: 'RTIH Amaravati Hub',
      subtitle: 'Amaravati Hub',
     videoUrl: 'https://youtu.be/cT6MoW-2M44',
      heroSub:
        'Driving Innovation and Entrepreneurship In The Amaravati Hub Region, Connecting Local Talent With Global Opportunities Through Comprehensive Startup Support And Incubation Programs.',
      heroImg: 'assets/spokes/spoke-banner.png',
      photo: 'assets/spokes/amaravati-spoke.png',
      about: [
        'RTIH Amaravati is the central Hub location of the Ratan Tata Innovation Hub (RTIH), dedicated to nurturing innovation and entrepreneurship across Andhra Pradesh.',
        'Located at Amaravati, the hub acts as Andhra Pradesh’s anchor for innovation-led development and inclusive entrepreneurship by providing access to infrastructure, mentorship, and industry partnerships.',
        'With State-of-the-art facilities, industry tested mentors across sectors and active global partners, the hub aims to transform ideas into impactful enterprises, strengthening the local and regional startup ecosystem.'
      ],
      mission:
        'RTIH Amaravati aims to build an inclusive innovation ecosystem that embeds innovation into governance and entrepreneurship, enabling the next generation of innovators in the state. The hub envisions itself to be the center that drives applied research, startup creation, and GovTech excellence.',
      region:
        'Amaravati, the capital of Andhra Pradesh, offers a strategic advantage for an innovation hub through its proximity to key government and administrative bodies, enabling strong policy support and collaboration. With excellent connectivity to Vijayawada and Guntur, and growing knowledge and business in the region, it provides an ideal environment for innovation, research, and sustainable growth.',
      
        leadership : {
  title: 'Board of Directors',
  members: [
    {
      name: 'Ravi Arora',
      role: 'Head, Group Innovation at Tata Sons',
      email: 'nittgk@gmail.com',
      phone: '+91 96776 82106',
      photo: 'assets/ravi-arora.png',
      linkedin: 'https://www.linkedin.com/in/ravi-arora-obraroorkeexlritata/' // ⬅️ example
    },
    {
      name: 'Mr. Anup Sahay',
      role: 'Head Corporate Strategy and Special Initiatives, L&T',
      email: 'donepudiraviteja@gmail.com',
      phone: '+91 79934 20011',
      photo: 'assets/anup-sahay.png',
      linkedin: 'https://www.linkedin.com/in/anup-sahay-9174364' // or real URL
    },
    {
      name: 'Sri. Ashutosh Shrivastava - I.A.S',
      role: 'Joint Collector, Guntur',
      email: 'khbindu.ca@gmail.com',
      phone: '+91 90300 23996',
      photo: 'assets/ashutosh.png',
      linkedin: 'https://guntur.ap.gov.in/whoswho/joint-collector'// optional
    },
    {
      name: 'Dr. Ajit Pratap Singh',
      role: 'Dean Admissions and Student Financial Aid, BITS Pilani',
      email: 'donepudiraviteja@gmail.com',
      phone: '+91 79934 20011',
      photo: 'assets/ajith.png',
      linkedin: 'https://www.linkedin.com/in/ajit-pratap-singh-380561a' // or real URL
    },
    {
      name: 'Dr. C Ramesh Kumar',
      role: 'Director, Office of Innovation Startup and Technology Transfer, VIT Vellore',
      email: 'tandi30@gmail.com',
      phone: '+91 98616 65777',
      photo: 'assets/ramesh.png',
      linkedin: 'https://www.linkedin.com/in/chidambaram-rameshkumar-1a172672' // optional
    },
  
    {
      name: 'Dr. Mahesh Venkata Panchagnula',
      role: 'Dean (Alumni and Corporate Relations), IIT Madras',
      email: 'tandi30@gmail.com',
      phone: '+91 98616 65777',
      photo: 'assets/mahesh-venkata.png',
      linkedin: 'https://www.linkedin.com/in/mahesh-panchagnula-6a89118' // optional
    },
    {
      name: 'Dr. Shantanu Sudhakar Patil',
      role: 'Director of  Entrepreneurship and Innovation, SRMIST',
      email: 'nittgk@gmail.com',
      phone: '+91 96776 82106',
      photo: 'assets/shantanu.png',
      linkedin: 'https://www.linkedin.com/in/shantanu-patil-2355122' // ⬅️ example
    },
    {
      name: 'Dr. Vijaya Bhaskar Marisetty',
      role: 'Dr. B.R. Ambedkar Chair Professor, IIM Visakhapatnam',
      email: 'khbindu.ca@gmail.com',
      phone: '+91 90300 23996',
      photo: 'assets/vijaya-bhaskr.png',
      linkedin: 'https://www.linkedin.com/in/vijaya-marisetty-689988179/'// optional
    },
    {
      name: 'Mr. Rachuri Kanaka Rao',
      role: 'Head – Corporate Affairs for Andhra Pradesh and Telangana',
      email: 'donepudiraviteja@gmail.com',
      phone: '+91 79934 20011',
      photo: 'assets/kanakarao.png',
      linkedin: 'https://www.linkedin.com/in/rachuri-kanaka-rao-28733710' // or real URL
    },
    {
      name: 'Mr. Ch Anil Kumar',
      role: 'Chief Executive Officer and Managing Director, Greenko Group',
      email: 'khbindu.ca@gmail.com',
      phone: '+91 90300 23996',
      photo: 'assets/anil.png',
      linkedin: 'https://greenkogroup.com/IR2021-22/annexures.php'// optional
    }, 
    {
      name: 'Mr. Robin Bhowmik',
      role: 'Chief Executive Officer - Skills & Education, Adani Group',
      email: 'tandi30@gmail.com',
      phone: '+91 98616 65777',
      photo: 'assets/robin.png',
      linkedin: 'https://www.linkedin.com/in/robinbhowmik' // optional
    },     
    {
      name: 'Mr. Kishore Arun Desai',
      role: 'Head, Corporate Strategy & Management Group, MEIL.',
      email: 'khbindu.ca@gmail.com',
      phone: '+91 90300 23996',
      photo: 'assets/kishore.png',
      linkedin: 'https://www.linkedin.com/in/kishore-desai-0302b24'// optional
    },
    
    {
      name: 'Mr. SGK Kishore',
      role: 'Executive Director (South) and Chief Innovation Officer, GMR Airports',
      email: 'nittgk@gmail.com',
      phone: '+91 96776 82106',
      photo: 'assets/sgk-kishore.png',
      linkedin: 'https://www.linkedin.com/in/sgkkishore' // ⬅️ example
    },
    
  ]
},

      
      facilities: {
        title: 'Infrastructure & Facilities',
        blurb: 'The spoke is housed in a modern facility at Sonovision Building, 4th Floor, Enikepadu, Vijayawada. It provides',
        photos: [
          { src: 'assets/spokes/am1.png', alt: 'Office workspace' },
          { src: 'assets/spokes/am2.png', alt: 'Open office area' },
          { src: 'assets/spokes/am3.png', alt: 'Meeting room' },
          { src: 'assets/spokes/am4.png', alt: 'Board room' },

        ],
        features: [
          { text: 'Co-working spaces and private offices' },
          { text: 'Meeting and conference rooms' },
          { text: 'Access to mentorship and networking sessions' },
          { text: 'Facilities for training and startup events' }
        ]
      },
      sectors: {
        title: 'Focus Sectors',
        items: [
          { icon: 'assets/spokes/amt-climate-tech.svg', label: 'Climate Tech' },
          { icon: 'assets/spokes/amt-blockchain.svg', label: 'Blockchain' },
          { icon: 'assets/spokes/amt-avgcxr.svg', label: 'AVGC & XR' },
          { icon: 'assets/spokes/amt-healthcare.svg', label: 'Health Care' },
          { icon: 'assets/spokes/amt-urban-systems.svg', label: 'Urban Systems' },
          { icon: 'assets/spokes/amt-supply-chain.svg', label: 'Supply Chain' },
        ]
      },
      services: {
        title: 'Programs & Services',
        items: [
          { title: 'Incubation & Acceleration Programs', image: 'assets/spokes/s1.jpg', icon: true },
          { title: 'Mentorship from industry experts and academia', image: 'assets/spokes/s2.jpg' },
          { title: 'Investor & funding linkages', image: 'assets/spokes/s3.jpg' },
          { title: 'Partnership opportunities with corporates and government agencies', image: 'assets/spokes/s4.jpg' },
          { title: 'Capacity building workshops and training sessions', image: 'assets/spokes/s5.jpg' }
        ]
      },
      partnerships: {
        title: 'Partnerships & Collaborations',
        blurb: `RTIH Vijayawada collaborates closely with academic institutions, industry leaders, and
        government bodies to strengthen the innovation ecosystem.`
      },
      applyLink: '/apply',
      contactLink: '/contact'
    },
    
    rajahmundry: {
      title: 'RTIH Rajamahendravaram Spoke',
      subtitle: 'Rajamahendravaram',
      videoUrl: ' https://youtu.be/MkqjuK-NdZQ',
      heroSub:
        'Driving Innovation and Entrepreneurship In The Rajahmundry Region, Connecting Local Talent With Global Opportunities Through Comprehensive Startup Support And Incubation Programs.',
      heroImg: 'assets/spokes/spoke-banner.png',
      photo: 'assets/spokes/rjmd.png',
      about: [
        'RTIH Rajahmundry is a key spoke under RTIH, strategically located in Rajamahendravaram. The center is envisioned as a hub to encourage entrepreneurial activity in the Godavari region.',
      ],
      mission: 'The spoke aligns with RTIH’s mission to promote entrepreneurship from the grassroots.',
      region: 'Rajahmundry, situated along the Godavari River, is known for its rich agricultural base, aquaculture, and cultural heritage.',
      facilities: {
        title: 'Infrastructure & Facilities',
        blurb: 'Modern co-working floors with meeting rooms and a 60-seater training hall.',
        photos: [
          { src: 'assets/spokes/rjy1.png', alt: 'Open office area' },
          { src: 'assets/spokes/rjy2.png', alt: 'Meeting room' },
          { src: 'assets/spokes/rjy3.png', alt: 'Private cabin' },
          { src: 'assets/spokes/rjy4.png', alt: 'Training hall' },
        ],
        features: [
          { text: 'Co-working spaces and private offices' },
          { text: 'Meeting and conference rooms' },
          { text: 'Access to mentorship and networking sessions' },
          { text: 'Facilities for training and startup events' },
        ]
      },
      sectors: {
        title: 'Focus Sectors',
        items: [
          { icon: 'assets/spokes/rjy-food-processing.svg', label: 'Food Processing' },
          { icon: 'assets/spokes/rjy-marine-tech.svg', label: 'Marine Tech' },
          { icon: 'assets/spokes/rjy-aquaculture.svg', label: 'Aquaculture' },
          { icon: 'assets/spokes/rjy-energy.svg', label: 'Energy Transition' },
        ]
      },
      services: {
        title: 'Programs & Services',
        items: [
          { title: 'Incubation & Acceleration Programs', image: 'assets/spokes/s1.jpg', icon: true },
          { title: 'Mentorship from industry experts and academia', image: 'assets/spokes/s2.jpg' },
          { title: 'Investor & funding linkages', image: 'assets/spokes/s3.jpg' },
          { title: 'Partnership opportunities with corporates and government agencies', image: 'assets/spokes/s4.jpg' },
          { title: 'Capacity building workshops and training sessions', image: 'assets/spokes/s5.jpg' }
        ]
      },
      partnerships: {
        title: 'Partnerships & Collaborations',
        blurb: 'Tie-ups with local universities and agro-industry associations to enable pilots and PoCs.'
      },
      applyLink: '/apply',
      contactLink: '/contact'
    },

    visakhapatnam: {
      title: 'RTIH Visakhapatnam Spoke',
      subtitle: 'Visakhapatnam',
      videoUrl: 'https://youtu.be/YjSfoGz-Kok?',
      heroSub:
        'Driving Innovation and Entrepreneurship In The Visakhapatnam Region, Connecting Local Talent With Global Opportunities Through Comprehensive Startup Support And Incubation Programs.',
      heroImg: 'assets/spokes/spoke-banner.png',
      photo: 'assets/spokes/vskp-rtih.png',
      about: [
        'RTIH Visakhapatnam, located in the coastal city of Vizag, serves as a dynamic spoke under the Ratan Tata Innovation Hub (RTIH). Positioned in a city renowned for its industrial base, IT growth, and educational ecosystem, the spoke is dedicated to driving innovation-led entrepreneurship.'
      ],
      mission:
        'With the mission of empowering local talent and startups, RTIH Visakhapatnam envisions becoming a leading center for entrepreneurial growth in Andhra Pradesh.',
      region: 'Visakhapatnam is home to IT companies, large-scale industries, port-based trade, and tourism.',
      facilities: {
        title: 'Infrastructure & Facilities',
        blurb: 'Seaside innovation floors with labs for prototyping & demo zones.',
        photos: [
          { src: 'assets/spokes/vskp1.png', alt: 'Office workspace' },
          { src: 'assets/spokes/vskp2.png', alt: 'Open office area' },
          { src: 'assets/spokes/vskp3.png', alt: 'Meeting room' },
          { src: 'assets/spokes/vskp4.png', alt: 'Board room' },
        ],
        features: [
          { text: 'Co-working spaces and private offices' },
          { text: 'Meeting and conference rooms' },
          { text: 'Access to mentorship and networking sessions' },
          { text: 'Facilities for training and startup events' },
        ]
      },
      sectors: {
        title: 'Focus Sectors',
        items: [
          { icon: 'assets/spokes/vksp-smart.svg', label: 'Smart Infra' },
          { icon: 'assets/spokes/vskp-blue.svg', label: 'Blue Economy' },
          { icon: 'assets/spokes/vskp-med.svg', label: 'Med Tech' },
          { icon: 'assets/spokes/vskp-biotech.svg', label: 'Biotech' },
          { icon: 'assets/spokes/vskp-fintech.svg', label: 'FinTech' },
        ]
      },
      services: {
        title: 'Programs & Services',
        items: [
          { title: 'Incubation & Acceleration Programs', image: 'assets/spokes/s1.jpg', icon: true },
          { title: 'Mentorship from industry experts and academia', image: 'assets/spokes/s2.jpg' },
          { title: 'Investor & funding linkages', image: 'assets/spokes/s3.jpg' },
          { title: 'Partnership opportunities with corporates and government agencies', image: 'assets/spokes/s4.jpg' },
          { title: 'Capacity building workshops and training sessions', image: 'assets/spokes/s5.jpg' }
        ]
      },
      partnerships: {
        title: 'Partnerships & Collaborations',
        blurb: 'Works with port authorities, IT SEZs, and local academia for market access.'
      },
      applyLink: '/apply',
      contactLink: '/contact'
    },

    tirupati: {
      title: 'RTIH Tirupati Spoke',
      subtitle: 'Tirupati',
      videoUrl: '',
      heroSub:
        'Driving Innovation and Entrepreneurship In The Tirupati Region, Connecting Local Talent With Global Opportunities Through Comprehensive Startup Support And Incubation Programs.',
      heroImg: 'assets/spokes/spoke-banner.png',
      photo: 'assets/spokes/tpty-rtih.png',
      about: [
        'RTIH Tirupati, a key spoke of RTIH is located Tirupati and leverages the strong academic presence and industrial growth of the region. The center is positioned to nurture startups in healthcare, electronics, and spirituality-linked innovations.'
      ],
      mission: 'Fostering innovation leveraging IIT Tirupati & SVU strengths.',
      region: 'Growing electronics, renewable energy, pharma; high tourism potential linked to Tirumala.',
      facilities: {
        title: 'Infrastructure & Facilities',
        blurb: 'Incubation bays, electronics benches, and seminar rooms.',
        photos: [
          { src: 'assets/spokes/tpty1.png', alt: 'Office workspace' },
          { src: 'assets/spokes/tpty2.png', alt: 'Open office area' },
          { src: 'assets/spokes/tpty3.png', alt: 'Meeting room' },
          { src: 'assets/spokes/tpty4.png', alt: 'Board room' },
        ],
        features: [
          { text: 'Co-working spaces and private offices' },
          { text: 'Meeting and conference rooms' },
          { text: 'Access to mentorship and networking sessions' },
          { text: 'Facilities for training and startup events' },
        ]
      },
      sectors: {
        title: 'Focus Sectors',
        items: [
          { icon: 'assets/spokes/tpty-battery.svg', label: 'Battery & Adv. Manufacturing' },
          { icon: 'assets/spokes/tpty-electronics.svg', label: 'Electronics Cluster' },
          { icon: 'assets/spokes/tpty-horti.svg', label: 'Horti Tech & Diary' },
          { icon: 'assets/spokes/tpty-space-tech.svg', label: 'Space Tech' },

        ]
      },
      services: {
        title: 'Programs & Services',
        items: [
          { title: 'Incubation & Acceleration Programs', image: 'assets/spokes/s1.jpg', icon: true },
          { title: 'Mentorship from industry experts and academia', image: 'assets/spokes/s2.jpg' },
          { title: 'Investor & funding linkages', image: 'assets/spokes/s3.jpg' },
          { title: 'Partnership opportunities with corporates and government agencies', image: 'assets/spokes/s4.jpg' },
          { title: 'Capacity building workshops and training sessions', image: 'assets/spokes/s5.jpg' }
        ]
      },
      partnerships: {
        title: 'Partnerships & Collaborations',
        blurb: 'MoUs with hospitals & academic labs for clinical validation.'
      },
      applyLink: '/apply',
      contactLink: '/contact'
    },

    anantapur: {
      title: 'RTIH Anantapuram Spoke',
      subtitle: 'Anantapuram',
       videoUrl: 'https://youtu.be/CAZWZEanaq0',

      heroSub:
        'Driving Innovation and Entrepreneurship In The Anantapur Region, Connecting Local Talent With Global Opportunities Through Comprehensive Startup Support And Incubation Programs.',
      heroImg: 'assets/spokes/spoke-banner.png',
      photo: 'assets/spokes/atp.png',
      about: [
        'RTIH Ananthapuramu is a key spoke in RTIH, strategically located in the Bengaluru-Hyderabad corridor. The location gives it access to large industries and enables open innovation with industries for high impact business solutions.'
      ],
      mission:
        'Cultivate a culture of entrepreneurship from the grassroots—One Family, One Entrepreneur.',
      region:
        'Strategic location on NH-44; auto components, textiles, renewables are growth pillars.',
      facilities: {
        title: 'Infrastructure & Facilities',
        blurb: 'Maker space for light prototyping, conference rooms, and event space.',
        photos: [
          { src: 'assets/spokes/atp1.png', alt: 'Office workspace' },
          { src: 'assets/spokes/atp2.png', alt: 'Open office area' },
          { src: 'assets/spokes/atp3.png', alt: 'Meeting room' },
          { src: 'assets/spokes/atp4.png', alt: 'Board room' },
        ],
        features: [
          { text: 'Co-working spaces and private offices' },
          { text: 'Meeting and conference rooms' },
          { text: 'Access to mentorship and networking sessions' },
          { text: 'Facilities for training and startup events' },
        ]
      },
      sectors: {
        title: 'Focus Sectors',
        items: [
          { icon: 'assets/spokes/atp-automotive.svg', label: 'Automotive & EV sys' },
          { icon: 'assets/spokes/atp-hybrid-re.svg', label: 'Hybrid RE' },
          { icon: 'assets/spokes/atp-agri-food-processing.svg', label: 'Agri & Food Processing' },
          { icon: 'assets/spokes/atp-logistics-warehousing.svg', label: 'Logistics-Warehousing' },
          { icon: 'assets/spokes/atp-defence.svg', label: 'Defence & Aerospace' },
        ]
      },
      services: {
        title: 'Programs & Services',
        items: [
          { title: 'Incubation & Acceleration Programs', image: 'assets/spokes/s1.jpg', icon: true },
          { title: 'Mentorship from industry experts and academia', image: 'assets/spokes/s2.jpg' },
          { title: 'Investor & funding linkages', image: 'assets/spokes/s3.jpg' },
          { title: 'Partnership opportunities with corporates and government agencies', image: 'assets/spokes/s4.jpg' },
          { title: 'Capacity building workshops and training sessions', image: 'assets/spokes/s5.jpg' }
        ]
      },
      partnerships: {
        title: 'Partnerships & Collaborations',
        blurb: 'Industry partnerships with OEMs; skilling tie-ups with polytechnics.'
      },
      applyLink: '/Apply for Programs',
      contactLink: '/Contact Spoke'
    }
  };

  // ---------- REACTIVE COMPUTED SIGNALS ----------
  spoke = computed<SpokeSections>(
    () => this.content[this.slug()] ?? this.content['vijayawada']
  );

  hasLeadership = computed(() => !!this.spoke().leadership?.members?.length);
  hasFacilities = computed(() => !!this.spoke().facilities);
  hasSectors = computed(() => !!this.spoke().sectors?.items?.length);
  hasServices = computed(() => !!this.spoke().services?.items?.length);
  hasPartnerships = computed(() => !!this.spoke().partnerships);

  // ---------- LIFECYCLE ----------
  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const slug = params.get('district') ?? 'vijayawada';
      this.slug.set(slug);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ---------- OPTIONAL HANDLERS ----------
  viewMore() {
    console.log('View more clicked');
  }

  private loadSpoke(slug: string) {
    // Placeholder if you later fetch remote content
    console.log(`Loaded spoke: ${slug}`);
  }
  
}
