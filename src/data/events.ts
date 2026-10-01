import type { ImageSourcePropType } from 'react-native';

export type EventAccess = 'Open Access' | 'Members Only';
export type EventLifecycle = 'upcoming' | 'past';
export type EventBookingMode = 'register' | 'waitlist' | 'closed';

export type GwmbEvent = {
  id: string;
  type: string;
  title: string;
  copy: string;
  date: string;
  dateShort: string;
  day: string;
  month: string;
  location: string;
  access: EventAccess;
  lifecycle: EventLifecycle;
  bookingMode: EventBookingMode;
  speaker: string;
  role: string;
  initials: string;
  tone: string;
  about: string;
  speakerAbout: string;
  eligibility: string;
  agenda: string[];
  prep: string[];
  image?: ImageSourcePropType;
};

export const events: Record<string, GwmbEvent> = {
  'product-manager': {
    id: 'product-manager', type: 'CAREER MENTORSHIP SESSION', title: 'Should You Become a Product Manager?',
    copy: 'Join Adeola Adeyemi for an honest look at product management, the skills you need and how to position yourself early.',
    date: 'Thursday 16 April · 7:30 PM', dateShort: 'Thu 16 · 7:30 PM', day: '16', month: 'APR', location: 'Live on Google Meet',
    access: 'Open Access', lifecycle: 'upcoming', bookingMode: 'register', speaker: 'Adeola Adeyemi', role: 'Senior Product Manager, Fintech', initials: 'AA', tone: '#E62B7F',
    about: 'A clear, practical conversation for anyone curious about product management and the many routes into the field.',
    speakerAbout: 'Adeola is a fintech product leader who helps teams turn complex customer needs into useful digital products. She brings candid, practical insight into building an early product career.',
    eligibility: 'Open to all registered GWMB app users. No previous product experience is required.',
    agenda: ['What product managers actually do', 'Skills and tools that matter', 'How to position yourself early', 'Live audience questions'],
    prep: ['Bring your questions', 'Have a notebook ready'], image: require('../../assets/media/adeola-mentorship.png'),
  },
  'cv-clinic': {
    id: 'cv-clinic', type: 'LIVE CAREER CLINIC', title: 'Live CV Review', copy: 'See what recruiters notice, get focused feedback and leave with practical improvements.',
    date: '05 October · 6:30 PM', dateShort: '05 Oct · 6:30 PM', day: '05', month: 'OCT', location: 'Live on Zoom', access: 'Members Only', lifecycle: 'upcoming', bookingMode: 'waitlist',
    speaker: 'GWMB Career Team', role: 'Career & Marketplace Preparation', initials: 'GW', tone: '#101010',
    about: 'A practical, supportive clinic built around real CV examples and changes you can make immediately.', speakerAbout: 'The GWMB Career Team supports young women with workplace preparation, positioning and practical application guidance.',
    eligibility: 'For verified GWMB members. Places are limited and waitlisted in the order requests are received.',
    agenda: ['The first 15-second scan', 'Stronger evidence and language', 'Live member CV reviews'], prep: ['Bring your current CV', 'Remove sensitive personal details'],
  },
  'side-hustle': {
    id: 'side-hustle', type: 'SMART MONEY GIRL LIVE', title: 'From Side Hustle to Real Income', copy: 'Honest lessons from women turning practical skills into sustainable income.',
    date: '19 October · 6:00 PM', dateShort: '19 Oct · 6:00 PM', day: '19', month: 'OCT', location: 'Live on Google Meet', access: 'Members Only', lifecycle: 'upcoming', bookingMode: 'register',
    speaker: 'Smart Money Girl Panel', role: 'Founders & young professionals', initials: 'SM', tone: '#C48414',
    about: 'A grounded conversation about pricing, finding customers and building consistent systems alongside school or work.', speakerAbout: 'A candid panel of young African women building income through services, products and digital work.',
    eligibility: 'For verified GWMB members interested in building or strengthening an income stream.', agenda: ['Choosing an offer', 'Pricing with confidence', 'Creating a simple sales rhythm'], prep: ['Write down your current idea', 'Bring one income goal'],
  },
  'progress-circle': {
    id: 'progress-circle', type: 'ACCOUNTABILITY CHECK-IN', title: 'October Progress Circle', copy: 'Reflect, reset and name the next action that will move your goal forward.',
    date: '31 October · 7:00 PM', dateShort: '31 Oct · 7:00 PM', day: '31', month: 'OCT', location: 'Live online', access: 'Members Only', lifecycle: 'upcoming', bookingMode: 'register',
    speaker: 'GWMB Growth Team', role: 'Personal Growth & Accountability', initials: 'PG', tone: '#5939C8',
    about: 'A calm facilitated space to reflect on your month, learn with peers and recommit without judgement.', speakerAbout: 'GWMB facilitators create thoughtful, structured spaces for reflection, accountability and sustainable growth.',
    eligibility: 'For verified GWMB members. Come ready to participate in a supportive small-group conversation.', agenda: ['Monthly reflection', 'Peer conversation', 'Next-action planning'], prep: ['Bring your current goal', 'Come ready to reflect honestly'],
  },
  'sister-circle': {
    id: 'sister-circle', type: 'COMMUNITY EXPERIENCE', title: 'September Sister Circle', copy: 'A warm, practical afternoon of peer learning, reflection and connection with the Lagos City Club.',
    date: '28 September · 3:00 PM', dateShort: '28 Sep · 3:00 PM', day: '28', month: 'SEP', location: 'Victoria Island, Lagos', access: 'Members Only', lifecycle: 'past', bookingMode: 'closed',
    speaker: 'Lagos City Club', role: 'Community & Sisterhood', initials: 'LC', tone: '#111111',
    about: 'Sister Circles are welcoming member spaces for real conversation, shared learning and meaningful connection.', speakerAbout: 'The Lagos City Club connects local GWMB members through peer learning, practical support and community experiences.',
    eligibility: 'This experience was reserved for verified GWMB members in the Lagos City Club.', agenda: ['Guided check-in', 'Peer learning circle', 'Connection and refreshments'], prep: ['Bring your current quarterly goal', 'Wear something comfortable'],
  },
};

export const eventList = Object.values(events);
export const upcomingEvents = eventList.filter((event) => event.lifecycle === 'upcoming');
export const pastEvents = eventList.filter((event) => event.lifecycle === 'past');
export const eventById = events;
