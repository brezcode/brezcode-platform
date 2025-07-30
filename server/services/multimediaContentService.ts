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

    // Breast self-examination content
    if (lowerMessage.includes('self-exam') || lowerMessage.includes('self exam') || lowerMessage.includes('how to check')) {
      multimedia.push({
        type: 'video',
        url: 'https://www.youtube.com/embed/Y8xN4dkiSQs',
        title: 'Breast Self-Examination: Step-by-Step Video Guide',
        description: 'Professional medical demonstration of proper breast self-examination technique',
        thumbnail: 'https://img.youtube.com/vi/Y8xN4dkiSQs/maxresdefault.jpg',
        metadata: {
          duration: '3:45',
          source: 'American Cancer Society'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/cancer/breast-cancer/screening-tests-and-early-detection/breast-self-exam.html',
        title: 'American Cancer Society - Breast Self-Exam Guide',
        description: 'Comprehensive guide with images and instructions from medical experts'
      });

      multimedia.push({
        type: 'file',
        url: 'https://www.nationalbreastcancer.org/sites/default/files/BSE-Guide.pdf',
        title: 'Printable Breast Self-Exam Guide (PDF)',
        description: 'Download and print this visual guide for reference',
        metadata: {
          fileSize: '2.1 MB',
          fileType: 'PDF'
        }
      });
    }

    // Mammogram and screening content
    if (lowerMessage.includes('mammogram') || lowerMessage.includes('screening') || lowerMessage.includes('x-ray')) {
      multimedia.push({
        type: 'video',
        url: 'https://www.youtube.com/embed/xJOJi_5W6vA',
        title: 'What to Expect During Your Mammogram',
        description: 'Medical professional explains the mammography process step-by-step',
        thumbnail: 'https://img.youtube.com/vi/xJOJi_5W6vA/maxresdefault.jpg',
        metadata: {
          duration: '4:12',
          source: 'Mayo Clinic'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/cancer/breast-cancer/screening-tests-and-early-detection/mammograms.html',
        title: 'Mammogram Screening Guidelines',
        description: 'Evidence-based recommendations by age and risk factors'
      });

      multimedia.push({
        type: 'link',
        url: 'https://www.radiologyinfo.org/en/info/mammo',
        title: 'Mammography - RadiologyInfo.org',
        description: 'Detailed medical information about mammography procedures and results'
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

    // Lifestyle and nutrition content
    if (lowerMessage.includes('diet') || lowerMessage.includes('exercise') || lowerMessage.includes('lifestyle') || lowerMessage.includes('prevention')) {
      multimedia.push({
        type: 'video',
        url: 'https://www.youtube.com/embed/kGOQfLFzJj8',
        title: 'Breast Cancer Prevention Through Lifestyle',
        description: 'Expert guidance on diet, exercise, and lifestyle modifications for breast health',
        thumbnail: 'https://img.youtube.com/vi/kGOQfLFzJj8/maxresdefault.jpg',
        metadata: {
          duration: '5:30',
          source: 'Harvard Medical School'
        }
      });
      
      multimedia.push({
        type: 'link',
        url: 'https://www.breastcancer.org/risk/factors/lifestyle',
        title: 'Lifestyle Factors & Breast Cancer Risk',
        description: 'Evidence-based prevention strategies from medical experts'
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

    // Treatment and medical procedures
    if (lowerMessage.includes('biopsy') || lowerMessage.includes('treatment') || lowerMessage.includes('surgery') || lowerMessage.includes('cancer')) {
      multimedia.push({
        type: 'link',
        url: 'https://www.cancer.org/cancer/breast-cancer/understanding-a-breast-cancer-diagnosis.html',
        title: 'Understanding Diagnosis & Treatment',
        description: 'Comprehensive guide to breast cancer diagnosis and treatment options'
      });
      
      multimedia.push({
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=400&h=250&fit=crop',
        title: 'Medical Care Team',
        description: 'Working with healthcare professionals for optimal care',
        metadata: {
          dimensions: '400x250'
        }
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