// data/jobs.ts
export type Job = {
  id: string;
  companyLogo?: string | null;
  jobTitle: string;
  companyName: string;
  location?: string;
  timestamp?: string;
  description?: string;
  jobImage?: string;
  salary?: string;
  onApply?: () => void;
};

const jobs: Job[] = [

    {
        id: '1',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png',
        jobTitle: 'Frontend Developer',
        companyName: 'TechCorp',
        location: 'Remote',
        timestamp: '2h ago',
        description: 'We are looking for a talented frontend developer to join our remote-first team and work on exciting projects.',
        jobImage: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67',
        onApply: () => alert('Applied to Frontend Developer'),
    },
    {
        id: '2',
        companyLogo: null,
        jobTitle: 'UI/UX Designer',
        companyName: 'Designify',
        location: 'Cape Town, SA',
        timestamp: '1d ago',
        description: 'Join our creative design team and help shape user experiences for global clients.',
        onApply: () => alert('Applied to UI/UX Designer'),
    },
    {
        id: '3',
   companyLogo: null,
        jobTitle: 'Backend Engineer',
        companyName: 'CloudBase',
        location: 'Johannesburg, SA',
        timestamp: '3d ago',
        description: 'Build and maintain high-performance APIs and backend services for a fast-growing SaaS company.',
        jobImage: 'https://images.unsplash.com/photo-1581090700227-4c4d1b004114',
        onApply: () => alert('Applied to Backend Engineer'),
    },
    {
        id: '4',
    companyLogo: null,
        jobTitle: 'Data Scientist',
        companyName: 'DataWave',
        location: 'Remote',
        timestamp: '5h ago',
        description: 'Analyze large datasets to uncover trends and provide actionable business insights.',
        jobImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        onApply: () => alert('Applied to Data Scientist'),
    },
    {
        id: '5',
        companyLogo: null,
        jobTitle: 'Mobile App Developer',
        companyName: 'Appify',
        location: 'Pretoria, SA',
        timestamp: '12h ago',
        description: 'Create engaging mobile experiences for both Android and iOS platforms.',
        onApply: () => alert('Applied to Mobile App Developer'),
    },
    {
        id: '6',
        companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
        jobTitle: 'Marketing Specialist',
        companyName: 'BrightReach',
        location: 'Durban, SA',
        timestamp: '2d ago',
        description: 'Plan and execute creative marketing campaigns that drive engagement and brand growth.',
        jobImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
        onApply: () => alert('Applied to Marketing Specialist'),
    },
    {
        id: '7',
      companyLogo: null,
        jobTitle: 'Product Manager',
        companyName: 'InnovaTech',
        location: 'Remote',
        timestamp: '4d ago',
        description: 'Lead product strategy and collaborate with cross-functional teams to bring products to life.',
        jobImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        onApply: () => alert('Applied to Product Manager'),
    },
];
  // ... keep the rest (3..7) as before


export default jobs;