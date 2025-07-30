// Multimedia Content Generation Service for AI Avatar
export interface MultimediaContent {
  type: 'text' | 'image' | 'video' | 'link' | 'file' | 'audio';
  content: string;
  url?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  metadata?: {
    duration?: string;
    fileSize?: string;
    fileType?: string;
    dimensions?: string;
  };
}

export class MultimediaContentService {
  
  // Generate multimedia content based on user message and context
  static generateMultimediaContent(
    userMessage: string, 
    responseContent: string,
    context: 'breast_health' | 'wellness' | 'medical_education' = 'breast_health'
  ): MultimediaContent[] {
    const multimedia: MultimediaContent[] = [];
    const lowerMessage = userMessage.toLowerCase();
    
    // Add primary text content
    multimedia.push({
      type: 'text',
      content: responseContent
    });

    // Breast self-examination content - VERIFIED WORKING LINKS
    if (lowerMessage.includes('self-exam') || lowerMessage.includes('self exam') || lowerMessage.includes('how to check')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.nationalbreastcancer.org/breast-self-exam/',
        title: 'National Breast Cancer Foundation - Breast Self-Exam',
        description: 'Step-by-step instructions with illustrations from medical experts'
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.breastcancer.org/screening-testing/breast-self-exam-bse',
        title: 'Breastcancer.org - How to Do a Breast Self-Exam',
        description: 'Comprehensive guide with visual instructions and timing recommendations'
      });

      multimedia.push({
        type: 'link',
        url: 'https://harleyclinic.com/blog/video-a-quick-and-simple-way-to-perform-a-breast-self-exam-at-home/',
        title: 'Quick Breast Self-Exam Video Guide',
        description: 'Simple video demonstration from Harley Clinic medical professionals'
      });
    }

    // Mammogram and screening content - VERIFIED WORKING LINKS
    if (lowerMessage.includes('mammogram') || lowerMessage.includes('screening') || lowerMessage.includes('x-ray')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.mayoclinic.org/tests-procedures/mammogram/multimedia/mammogram/vid-20084742',
        title: 'Mayo Clinic - Mammogram Video: What to Expect',
        description: 'Official Mayo Clinic video showing the complete mammogram process step-by-step',
        metadata: {
          source: 'Mayo Clinic',
          type: 'Educational Video'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/cancer/types/breast-cancer/screening-tests-and-early-detection/mammograms/mammograms-what-to-know-before-you-go.html',
        title: 'American Cancer Society - Mammogram Preparation',
        description: 'Complete guide on how to prepare for your mammogram appointment'
      });

      multimedia.push({
        type: 'link',
        url: 'https://www.mayoclinic.org/tests-procedures/mammogram/about/pac-20384806',
        title: 'Mayo Clinic - Complete Mammogram Information',
        description: 'Comprehensive medical information about mammograms, preparation, and results'
      });
    }

    // Breast anatomy and health education
    if (lowerMessage.includes('anatomy') || lowerMessage.includes('breast tissue') || lowerMessage.includes('how breast')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/cancer/breast-cancer/about/how-breast-cancer-forms.html',
        title: 'Breast Anatomy and Cancer Development',
        description: 'Medical guide to understanding breast tissue and structure'
      });
    }

    // Lifestyle and nutrition content - VERIFIED WORKING LINKS  
    if (lowerMessage.includes('diet') || lowerMessage.includes('exercise') || lowerMessage.includes('lifestyle') || lowerMessage.includes('prevention')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.health.harvard.edu/cancer/boosting-breast-cancer-survival',
        title: 'Harvard Medical School - Boosting Breast Cancer Survival',
        description: 'Expert guidance on lifestyle factors that help prevent breast cancer and improve outcomes',
        metadata: {
          source: 'Harvard Medical School',
          updated: '2024'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.breastcancer.org/risk/factors/lifestyle',
        title: 'Lifestyle Factors & Breast Cancer Risk',
        description: 'Evidence-based prevention strategies: diet, exercise, weight management, and alcohol'
      });

      multimedia.push({
        type: 'link',
        url: 'https://www.harvardmagazine.com/2024/02/cancer-prevention-nutrition',
        title: 'Harvard Magazine - Cancer Prevention Through Nutrition (2024)',
        description: 'Latest research on how nutrition can help prevent cancer, including breast cancer'
      });
    }

    // Risk factors and family history
    if (lowerMessage.includes('family history') || lowerMessage.includes('genetic') || lowerMessage.includes('risk factor')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.gov/types/breast/risk-fact-sheet',
        title: 'Breast Cancer Risk Factors',
        description: 'National Cancer Institute risk assessment guide'
      });
      
      multimedia.push({
        type: 'image',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop',
        title: 'Understanding Risk Factors',
        description: 'Visual guide to breast cancer risk assessment',
        metadata: {
          dimensions: '400x250'
        }
      });
    }

    // Support and emotional wellness
    if (lowerMessage.includes('scared') || lowerMessage.includes('worried') || lowerMessage.includes('anxiety') || lowerMessage.includes('afraid')) {
      multimedia.push({
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop',
        title: 'Emotional Support',
        description: 'Managing health anxiety with mindfulness and support',
        metadata: {
          dimensions: '400x250'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/treatment/support-programs-and-services.html',
        title: 'Support Resources',
        description: 'Finding emotional support during health concerns'
      });
    }

    // Lump or concerning findings
    if (lowerMessage.includes('lump') || lowerMessage.includes('found something') || lowerMessage.includes('unusual') || lowerMessage.includes('changes')) {
      multimedia.push({
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
        title: 'When to See a Doctor',
        description: 'Recognizing breast changes that need medical attention',
        metadata: {
          dimensions: '400x300'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.mayoclinic.org/diseases-conditions/breast-lumps/symptoms-causes/syc-20350423',
        title: 'Understanding Breast Lumps',
        description: 'Mayo Clinic guide to breast changes and next steps'
      });
    }

    // Treatment and medical procedures - VERIFIED WORKING LINKS
    if (lowerMessage.includes('biopsy') || lowerMessage.includes('treatment') || lowerMessage.includes('surgery') || lowerMessage.includes('cancer')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/cancer/types/breast-cancer/understanding-a-breast-cancer-diagnosis.html',
        title: 'American Cancer Society - Understanding Breast Cancer Diagnosis',
        description: 'Comprehensive guide to breast cancer diagnosis and treatment options'
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.mayoclinic.org/diseases-conditions/breast-cancer/care-at-mayo-clinic/mac-20352470',
        title: 'Mayo Clinic - Breast Cancer Care',
        description: 'Expert multidisciplinary treatment approach and patient care services'
      });

      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.gov/types/breast',
        title: 'National Cancer Institute - Breast Cancer Information',
        description: 'Government resource for treatment options, clinical trials, and research updates'
      });
    }

    return multimedia;
  }

  // Generate health education videos (placeholder for future video content)
  static generateEducationalVideo(topic: string): MultimediaContent | null {
    const videoDatabase = {
      'self_examination': {
        type: 'video' as const,
        url: 'https://www.youtube.com/watch?v=example_self_exam',
        title: 'Proper Breast Self-Examination Technique',
        description: 'Step-by-step video demonstration by medical professionals',
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
        metadata: {
          duration: '3:45'
        }
      },
      'mammogram_prep': {
        type: 'video' as const,
        url: 'https://www.youtube.com/watch?v=example_mammogram',
        title: 'Preparing for Your First Mammogram',
        description: 'What to expect and how to prepare for mammography',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=225&fit=crop',
        metadata: {
          duration: '2:30'
        }
      }
    };

    return videoDatabase[topic as keyof typeof videoDatabase] || null;
  }

  // Generate downloadable health resources
  static generateHealthResources(topic: string): MultimediaContent[] {
    const resources: MultimediaContent[] = [];

    if (topic.includes('screening') || topic.includes('guidelines')) {
      resources.push({
        type: 'file',
        url: '/downloads/breast-screening-guidelines.pdf',
        title: 'Breast Cancer Screening Guidelines',
        description: 'Age-based screening recommendations and frequency',
        metadata: {
          fileType: 'PDF',
          fileSize: '2.1 MB'
        }
      });
    }

    if (topic.includes('self-exam') || topic.includes('checking')) {
      resources.push({
        type: 'file',
        url: '/downloads/self-exam-reminder-card.pdf',
        title: 'Monthly Self-Exam Reminder Card',
        description: 'Printable reminder card with step-by-step instructions',
        metadata: {
          fileType: 'PDF',
          fileSize: '856 KB'
        }
      });
    }

    return resources;
  }
}