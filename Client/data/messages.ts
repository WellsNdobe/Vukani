export type Message = {
  id: string;
  companyName: string;
  companyLogo: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
};

export const messages: Message[] = [
  {
    id: '1',
    companyName: 'TechCorp',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png',
    lastMessage: 'Your application for Frontend Developer has been received.',
    timestamp: '5m ago',
    unreadCount: 1,
  },
  {
    id: '2',
    companyName: 'Designify',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    lastMessage: 'We’d like to invite you for a portfolio review session.',
    timestamp: '20m ago',
  },
  {
    id: '3',
    companyName: 'CodeWorks',
    companyLogo: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
    lastMessage: 'Thanks for applying. Our team will be in touch soon.',
    timestamp: '1h ago',
  },
  {
    id: '4',
    companyName: 'HealthPlus',
    companyLogo: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
    lastMessage: 'We have reviewed your CV, awaiting next steps.',
    timestamp: '3h ago',
    unreadCount: 3,
  },
  {
    id: '5',
    companyName: 'FinEdge',
    companyLogo: 'https://cdn-icons-png.flaticon.com/512/825/825454.png',
    lastMessage: 'Your application has progressed to the shortlist stage.',
    timestamp: '1d ago',
  },
  {
    id: '6',
    companyName: 'EduTech SA',
    companyLogo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    lastMessage: 'Interview scheduled for Friday at 10am.',
    timestamp: '2d ago',
  },
  {
    id: '7',
    companyName: 'Vukani System',
    companyLogo: 'https://cdn-icons-png.flaticon.com/512/1827/1827504.png',
    lastMessage: 'Welcome to Vukani Jobs! Your profile is set up successfully.',
    timestamp: '3d ago',
  },
];
