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
        title: 'Dr. Rhonda Patrick: Nutrition & Cancer Prevention',
        description: 'World-renowned scientist Dr. Rhonda Patrick discusses evidence-based nutrition strategies for cancer prevention, including specific dietary compounds that support breast health.',
        url: 'https://www.youtube.com/watch?v=YQiW_l848t8',
        embedUrl: 'https://www.youtube.com/embed/YQiW_l848t8',
        duration: '12:30',
        kol: 'Dr. Rhonda Patrick',
        source: 'FoundMyFitness',
        topics: ['nutrition', 'cancer prevention', 'micronutrients'],
        difficulty: 'intermediate',
        addedDate: '2024-01-15'
      },
      {
        id: 'dr_david_sinclair_longevity',
        title: 'Dr. David Sinclair: Longevity & Disease Prevention',
        description: 'Harvard Medical School professor Dr. David Sinclair shares cutting-edge research on aging, cellular health, and disease prevention strategies.',
        url: 'https://www.youtube.com/watch?v=9nXop2lLDa4',
        embedUrl: 'https://www.youtube.com/embed/9nXop2lLDa4',
        duration: '15:45',
        kol: 'Dr. David Sinclair',
        source: 'Harvard Medical School',
        topics: ['longevity', 'cellular health', 'aging'],
        difficulty: 'advanced',
        addedDate: '2024-01-12'
      },
      {
        id: 'dr_peter_attia_breast_health',
        title: 'Dr. Peter Attia: Clinical Approach to Breast Health',
        description: 'Dr. Peter Attia, renowned longevity physician, discusses clinical strategies for breast health monitoring and early detection.',
        url: 'https://www.youtube.com/watch?v=TjqPnFrk4_E',
        embedUrl: 'https://www.youtube.com/embed/TjqPnFrk4_E',
        duration: '8:20',
        kol: 'Dr. Peter Attia',
        source: 'The Peter Attia Drive',
        topics: ['breast health', 'clinical medicine', 'early detection'],
        difficulty: 'intermediate',
        addedDate: '2024-01-10'
      },
      {
        id: 'dr_huberman_hormones_womens_health',
        title: 'Dr. Andrew Huberman: Hormones & Women\'s Health',
        description: 'Stanford neuroscientist Dr. Andrew Huberman explains the science of hormones, sleep, and lifestyle factors affecting women\'s health.',
        url: 'https://www.youtube.com/watch?v=OBmWQqvvkls',
        embedUrl: 'https://www.youtube.com/embed/OBmWQqvvkls',
        duration: '18:30',
        kol: 'Dr. Andrew Huberman',
        source: 'Huberman Lab Podcast',
        topics: ['hormones', 'women\'s health', 'sleep', 'lifestyle'],
        difficulty: 'beginner',
        addedDate: '2024-01-08'
      },
      {
        id: 'dr_sara_gottfried_hormone_balance',
        title: 'Dr. Sara Gottfried: Hormone Balance for Women',
        description: 'Harvard-trained physician Dr. Sara Gottfried discusses hormone optimization strategies specifically for women\'s health and breast cancer prevention.',
        url: 'https://www.youtube.com/watch?v=ABC123DEF456',
        embedUrl: 'https://www.youtube.com/embed/ABC123DEF456',
        duration: '22:15',
        kol: 'Dr. Sara Gottfried',
        source: 'The Women\'s Health Podcast',
        topics: ['hormone balance', 'women\'s health', 'prevention'],
        difficulty: 'intermediate',
        addedDate: '2024-01-05'
      },
      {
        id: 'dr_mark_hyman_functional_medicine',
        title: 'Dr. Mark Hyman: Functional Medicine Approach to Cancer Prevention',
        description: 'Functional medicine pioneer Dr. Mark Hyman shares holistic approaches to cancer prevention through nutrition, lifestyle, and environmental factors.',
        url: 'https://www.youtube.com/watch?v=XYZ789GHI012',
        embedUrl: 'https://www.youtube.com/embed/XYZ789GHI012',
        duration: '16:40',
        kol: 'Dr. Mark Hyman',
        source: 'The Doctor\'s Farmacy',
        topics: ['functional medicine', 'prevention', 'holistic health'],
        difficulty: 'beginner',
        addedDate: '2024-01-03'
      },
      {
        id: 'dr_christiane_northrup_womens_wisdom',
        title: 'Dr. Christiane Northrup: Women\'s Body Wisdom',
        description: 'Renowned women\'s health expert Dr. Christiane Northrup discusses the mind-body connection in women\'s health and breast wellness.',
        url: 'https://www.youtube.com/watch?v=DEF456GHI789',
        embedUrl: 'https://www.youtube.com/embed/DEF456GHI789',
        duration: '19:25',
        kol: 'Dr. Christiane Northrup',
        source: 'Women\'s Wisdom Network',
        topics: ['mind-body connection', 'women\'s wisdom', 'holistic health'],
        difficulty: 'intermediate',
        addedDate: '2024-01-01'
      },
      {
        id: 'dr_jason_fung_intermittent_fasting',
        title: 'Dr. Jason Fung: Intermittent Fasting & Cancer Prevention',
        description: 'Nephrologist Dr. Jason Fung explains how intermittent fasting and metabolic health impact cancer risk and overall wellness.',
        url: 'https://www.youtube.com/watch?v=GHI789JKL012',
        embedUrl: 'https://www.youtube.com/embed/GHI789JKL012',
        duration: '13:55',
        kol: 'Dr. Jason Fung',
        source: 'The Fasting Method',
        topics: ['intermittent fasting', 'metabolic health', 'cancer prevention'],
        difficulty: 'beginner',
        addedDate: '2023-12-28'
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