// KOL Video Service for Managing Educational Content
export interface KOLVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  thumbnail?: string;
  duration: string;
  kol: string;
  source: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  addedDate: string;
}

export class KOLVideoService {
  // Get all curated KOL videos for breast health education
  static getAllKOLVideos(): KOLVideo[] {
    return [
      {
        id: 'dr_rhonda_patrick_nutrition_cancer',
        title: 'Dr. Rhonda Patrick: Micronutrients & Disease Prevention',
        description: 'World-renowned scientist Dr. Rhonda Patrick discusses evidence-based nutrition strategies, micronutrients, and dietary compounds that support health and disease prevention.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '68:42',
        kol: 'Dr. Rhonda Patrick',
        source: 'FoundMyFitness',
        topics: ['nutrition', 'micronutrients', 'disease prevention'],
        difficulty: 'intermediate',
        addedDate: '2024-01-15'
      },
      {
        id: 'dr_david_sinclair_longevity',
        title: 'Dr. Ben Bikman: How To Reverse Insulin Resistance',
        description: 'Expert metabolic researcher Dr. Ben Bikman explains how to detect and reverse insulin resistance through diet, exercise, and sleep optimization.',
        url: 'https://www.youtube.com/watch?v=gMyosH19G24',
        embedUrl: 'https://www.youtube.com/embed/gMyosH19G24',
        duration: '47:32',
        kol: 'Dr. Ben Bikman',
        source: 'FoundMyFitness',
        topics: ['metabolic health', 'insulin resistance', 'diet'],
        difficulty: 'intermediate',
        addedDate: '2024-01-12'
      },
      {
        id: 'dr_peter_attia_breast_health',
        title: 'Dr. Peter Attia: The Importance of Cancer Screening',
        description: 'Longevity physician Dr. Peter Attia discusses clinical strategies for cancer screening, early detection, and the critical importance of proactive health monitoring.',
        url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
        duration: '45:22',
        kol: 'Dr. Peter Attia',
        source: 'The Peter Attia Drive',
        topics: ['cancer screening', 'early detection', 'preventive medicine'],
        difficulty: 'intermediate',
        addedDate: '2024-01-10'
      },
      {
        id: 'dr_huberman_hormones_womens_health',
        title: 'Dr. Andrew Huberman: Female Hormone Health & Optimization',
        description: 'Stanford neuroscientist Dr. Andrew Huberman explains the science of hormones, sleep, stress, and lifestyle factors specifically affecting women\'s health and hormonal balance.',
        url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
        duration: '92:15',
        kol: 'Dr. Andrew Huberman',
        source: 'Huberman Lab',
        topics: ['female hormones', 'women\'s health', 'stress management', 'sleep optimization'],
        difficulty: 'intermediate',
        addedDate: '2024-01-08'
      },
      {
        id: 'dr_sara_gottfried_hormone_balance',
        title: 'Dr. Darren Candow: The Optimal Creatine Protocol for Brain Health',
        description: 'Research expert Dr. Darren Candow explains how creatine supports muscle performance, brain function, and longevity with evidence-based protocols.',
        url: 'https://www.youtube.com/watch?v=ICsO-EHI_vM',
        embedUrl: 'https://www.youtube.com/embed/ICsO-EHI_vM',
        duration: '42:18',
        kol: 'Dr. Darren Candow',
        source: 'FoundMyFitness',
        topics: ['creatine', 'brain health', 'supplements', 'performance'],
        difficulty: 'intermediate',
        addedDate: '2024-01-05'
      },
      {
        id: 'dr_mark_hyman_functional_medicine',
        title: 'Dr. Rhonda Patrick: Q&A on Cancer Prevention & Supplements',
        description: 'Dr. Rhonda Patrick answers premium member questions about cancer prevention, supplement protocols, and evidence-based health strategies.',
        url: 'https://www.youtube.com/watch?v=xXQUfUVbshk',
        embedUrl: 'https://www.youtube.com/embed/xXQUfUVbshk',
        duration: '28:15',
        kol: 'Dr. Rhonda Patrick',
        source: 'FoundMyFitness',
        topics: ['cancer prevention', 'supplements', 'Q&A'],
        difficulty: 'intermediate',
        addedDate: '2024-01-03'
      },
      {
        id: 'dr_christiane_northrup_womens_wisdom',
        title: 'Dr. Rhonda Patrick: Cancer Prevention & Lifestyle Medicine',
        description: 'Dr. Rhonda Patrick discusses comprehensive lifestyle approaches to cancer prevention, including nutrition, exercise, and stress management.',
        url: 'https://www.youtube.com/watch?v=Hc5YgTvUaJY',
        embedUrl: 'https://www.youtube.com/embed/Hc5YgTvUaJY',
        duration: '35:22',
        kol: 'Dr. Rhonda Patrick',
        source: 'FoundMyFitness',
        topics: ['cancer prevention', 'lifestyle medicine', 'nutrition'],
        difficulty: 'intermediate',
        addedDate: '2024-01-01'
      },
      {
        id: 'dr_jason_fung_intermittent_fasting',
        title: 'Dr. Rhonda Patrick: Supplement Protocol & Health Optimization',
        description: 'Dr. Rhonda Patrick shares her complete supplement routine with dosages and brands for optimal health and disease prevention.',
        url: 'https://www.youtube.com/watch?v=LfrZ_fT8unY',
        embedUrl: 'https://www.youtube.com/embed/LfrZ_fT8unY',
        duration: '42:30',
        kol: 'Dr. Rhonda Patrick',
        source: 'FoundMyFitness',
        topics: ['supplements', 'health optimization', 'protocols'],
        difficulty: 'intermediate',
        addedDate: '2023-12-28'
      },
      {
        id: 'dr_sara_gottfried_huberman_hormones',
        title: 'Dr. Sara Gottfried: How to Optimize Female Hormone Health',
        description: 'Harvard-trained gynecologist Dr. Sara Gottfried discusses hormone optimization, microbiome health, birth control, and women\'s health across all life stages.',
        url: 'https://www.youtube.com/watch?v=GVRDGQhoEYQ',
        embedUrl: 'https://www.youtube.com/embed/GVRDGQhoEYQ',
        duration: '151:30',
        kol: 'Dr. Sara Gottfried',
        source: 'Huberman Lab',
        topics: ['female hormones', 'women\'s health', 'microbiome', 'birth control'],
        difficulty: 'intermediate',
        addedDate: '2024-01-20'
      }
    ];
  }

  // Get videos by KOL name
  static getVideosByKOL(kolName: string): KOLVideo[] {
    return this.getAllKOLVideos().filter(video => 
      video.kol.toLowerCase().includes(kolName.toLowerCase())
    );
  }

  // Get videos by topic
  static getVideosByTopic(topic: string): KOLVideo[] {
    return this.getAllKOLVideos().filter(video => 
      video.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    );
  }

  // Get video by ID
  static getVideoById(id: string): KOLVideo | undefined {
    return this.getAllKOLVideos().find(video => video.id === id);
  }

  // Get recent videos (last 30 days)
  static getRecentVideos(): KOLVideo[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.getAllKOLVideos().filter(video => 
      new Date(video.addedDate) >= thirtyDaysAgo
    );
  }
}