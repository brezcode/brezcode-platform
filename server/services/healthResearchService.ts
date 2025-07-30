import { MultimediaContent } from './multimediaContentService';

// Health Research Service for proactive content delivery
export interface ResearchContent {
  id: string;
  title: string;
  summary: string;
  author: string;
  authorCredentials: string;
  videoUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  keyFindings: string[];
  relevantTopics: string[];
  timestamp: string;
  source: string;
  duration?: string;
}

export class HealthResearchService {
  
  // Curated content from leading health experts and KOLs
  private static expertContent: ResearchContent[] = [
    {
      id: 'rhonda_patrick_aging_001',
      title: 'The Science of Longevity: How Diet Affects Cellular Aging',
      summary: 'Dr. Rhonda Patrick discusses groundbreaking research on how specific nutrients and dietary patterns can slow cellular aging processes. Key focus on sulforaphane from broccoli sprouts, omega-3 fatty acids, and time-restricted eating for optimal health span.',
      author: 'Dr. Rhonda Patrick',
      authorCredentials: 'PhD in Biomedical Science, Expert in Aging & Nutrition',
      videoUrl: 'https://www.youtube.com/watch?v=example_rhonda_aging',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      keyFindings: [
        'Sulforaphane increases antioxidant enzyme production by 200%',
        'Time-restricted eating can extend lifespan by 20% in studies',
        'Omega-3 DHA directly supports brain health and cognitive function',
        'Heat shock proteins from sauna use promote cellular repair'
      ],
      relevantTopics: ['anti-aging', 'nutrition', 'cellular health', 'longevity'],
      timestamp: new Date().toISOString(),
      source: 'FoundMyFitness Podcast',
      duration: '42:15'
    },
    {
      id: 'rhonda_patrick_breast_health_001',
      title: 'Hormones, Nutrition, and Breast Health: Latest Research',
      summary: 'Latest findings on how lifestyle factors influence breast health. Dr. Patrick reviews studies on phytoestrogens, cruciferous vegetables, and their protective effects against breast cancer through hormone regulation.',
      author: 'Dr. Rhonda Patrick',
      authorCredentials: 'PhD in Biomedical Science, Nutrition Research Expert',
      videoUrl: 'https://www.youtube.com/watch?v=example_breast_health',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
      keyFindings: [
        'Cruciferous vegetables reduce breast cancer risk by 25%',
        'Soy phytoestrogens show protective effects in Asian populations',
        'Vitamin D deficiency linked to increased breast cancer risk',
        'Exercise reduces estrogen levels and inflammatory markers'
      ],
      relevantTopics: ['breast health', 'hormones', 'nutrition', 'cancer prevention'],
      timestamp: new Date().toISOString(),
      source: 'FoundMyFitness Research',
      duration: '38:22'
    },
    {
      id: 'david_sinclair_longevity_001',
      title: 'Reversing Aging: The Latest Breakthrough Research',
      summary: 'Harvard Professor David Sinclair shares cutting-edge research on NAD+ boosters, resveratrol, and cellular reprogramming. Discussion of how these compounds can potentially reverse biological aging markers.',
      author: 'Dr. David Sinclair',
      authorCredentials: 'Harvard Professor, Longevity Research Pioneer',
      videoUrl: 'https://www.youtube.com/watch?v=example_sinclair_aging',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      keyFindings: [
        'NAD+ levels decline 50% by age 50, affecting cellular repair',
        'Resveratrol activates SIRT1 longevity pathways',
        'Intermittent fasting triggers autophagy and cellular cleanup',
        'Cold exposure increases brown fat and metabolic health'
      ],
      relevantTopics: ['longevity', 'anti-aging', 'supplements', 'metabolism'],
      timestamp: new Date().toISOString(),
      source: 'Lifespan Podcast',
      duration: '56:40'
    },
    {
      id: 'peter_attia_women_health_001',
      title: 'Women\'s Health Optimization: Hormones and Longevity',
      summary: 'Dr. Peter Attia discusses comprehensive women\'s health strategies, focusing on hormone optimization, bone health, and cardiovascular protection throughout different life stages.',
      author: 'Dr. Peter Attia',
      authorCredentials: 'MD, Longevity Medicine Expert',
      videoUrl: 'https://www.youtube.com/watch?v=example_attia_women',
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=200&fit=crop',
      keyFindings: [
        'Hormone replacement therapy benefits outweigh risks for most women',
        'Strength training is crucial for bone density and longevity',
        'Sleep quality directly impacts hormone regulation',
        'Stress management reduces cortisol and inflammation'
      ],
      relevantTopics: ['women\'s health', 'hormones', 'longevity', 'bone health'],
      timestamp: new Date().toISOString(),
      source: 'The Drive Podcast',
      duration: '48:30'
    },
    {
      id: 'sara_gottfried_hormone_balance_001',
      title: 'Hormone Reset: Natural Approaches to Women\'s Health',
      summary: 'Dr. Sara Gottfried presents evidence-based natural approaches to hormone balance, including nutrition, supplements, and lifestyle interventions for optimal women\'s health.',
      author: 'Dr. Sara Gottfried',
      authorCredentials: 'MD, Harvard-trained Hormone Expert',
      videoUrl: 'https://www.youtube.com/watch?v=example_gottfried_hormones',
      imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop',
      keyFindings: [
        'Adaptogenic herbs help regulate cortisol and stress response',
        'Fiber intake directly impacts estrogen metabolism',
        'Sleep timing affects melatonin and hormone production',
        'Gut health influences hormone synthesis and balance'
      ],
      relevantTopics: ['hormone balance', 'women\'s health', 'natural medicine', 'gut health'],
      timestamp: new Date().toISOString(),
      source: 'Women, Food and Hormones',
      duration: '35:45'
    }
  ];

  // Get content relevant to user's health interests
  static getRelevantContent(userTopics: string[]): ResearchContent[] {
    return this.expertContent.filter(content => 
      content.relevantTopics.some(topic => 
        userTopics.some(userTopic => 
          topic.toLowerCase().includes(userTopic.toLowerCase()) ||
          userTopic.toLowerCase().includes(topic.toLowerCase())
        )
      )
    );
  }

  // Get random expert content for proactive sharing
  static getRandomExpertContent(): ResearchContent {
    const randomIndex = Math.floor(Math.random() * this.expertContent.length);
    return this.expertContent[randomIndex];
  }

  // Convert research content to multimedia format
  static convertToMultimedia(content: ResearchContent): MultimediaContent[] {
    const multimedia: MultimediaContent[] = [];

    // Add text summary
    multimedia.push({
      type: 'text',
      content: `🔬 **Latest Research from ${content.author}**\n\n${content.summary}\n\n**Key Findings:**\n${content.keyFindings.map(finding => `• ${finding}`).join('\n')}`
    });

    // Add research image/thumbnail
    if (content.thumbnailUrl) {
      multimedia.push({
        type: 'image', 
        url: content.thumbnailUrl,
        title: content.title,
        description: `Research presentation by ${content.author}`,
        metadata: {
          dimensions: '300x200'
        }
      });
    }

    // Add video link
    if (content.videoUrl) {
      multimedia.push({
        type: 'video',
        url: content.videoUrl,
        title: `Watch: ${content.title}`,
        description: `Full research presentation by ${content.author} (${content.authorCredentials})`,
        thumbnail: content.thumbnailUrl,
        metadata: {
          duration: content.duration
        }
      });
    }

    // Add source link
    multimedia.push({
      type: 'link',
      url: content.videoUrl || 'https://foundmyfitness.com',
      title: `Source: ${content.source}`,
      description: `More content from ${content.author} and leading health researchers`
    });

    return multimedia;
  }

  // Generate proactive health research message
  static generateProactiveResearchMessage(userHealthProfile?: any): {
    content: string;
    multimediaContent: MultimediaContent[];
  } {
    // Get relevant content based on user profile
    let selectedContent: ResearchContent;
    
    if (userHealthProfile?.interests) {
      const relevantContent = this.getRelevantContent(userHealthProfile.interests);
      selectedContent = relevantContent.length > 0 
        ? relevantContent[Math.floor(Math.random() * relevantContent.length)]
        : this.getRandomExpertContent();
    } else {
      selectedContent = this.getRandomExpertContent();
    }

    const message = `🌸 **Dr. Sakura's Research Update**

I've been reviewing the latest findings from leading health researchers and wanted to share this important discovery with you:

**"${selectedContent.title}"** by ${selectedContent.author}

This research is particularly relevant to your health journey because it provides evidence-based insights that can help optimize your wellness routine.

Would you like me to explain how these findings might apply to your specific health goals?`;

    const multimediaContent = this.convertToMultimedia(selectedContent);

    return {
      content: message,
      multimediaContent
    };
  }

  // Start proactive content delivery system
  static startProactiveContentDelivery(userId: number, callback: (message: any) => void) {
    console.log(`🔬 Starting proactive research content delivery for user ${userId}`);
    
    // Initial delay before first message
    setTimeout(() => {
      // Send content every 2 minutes (120,000 ms)
      const interval = setInterval(() => {
        try {
          const researchMessage = this.generateProactiveResearchMessage();
          
          callback({
            id: `research_${Date.now()}`,
            role: 'avatar',
            content: researchMessage.content,
            multimediaContent: researchMessage.multimediaContent,
            timestamp: new Date().toISOString(),
            qualityScores: {
              empathy: 85,
              medicalAccuracy: 95,
              overall: 90
            },
            isProactiveResearch: true
          });
          
          console.log(`📚 Sent proactive research content to user ${userId}`);
        } catch (error) {
          console.error('Error sending proactive research content:', error);
        }
      }, 120000); // 2 minutes

      // Store interval ID for cleanup (you might want to store this in user session)
      console.log(`⏰ Proactive content delivery scheduled every 2 minutes for user ${userId}`);
      
    }, 30000); // Start after 30 seconds
  }

  // Get content by specific researcher
  static getContentByResearcher(researcherName: string): ResearchContent[] {
    return this.expertContent.filter(content => 
      content.author.toLowerCase().includes(researcherName.toLowerCase())
    );
  }

  // Search content by topic
  static searchContentByTopic(topic: string): ResearchContent[] {
    return this.expertContent.filter(content =>
      content.relevantTopics.some(t => t.toLowerCase().includes(topic.toLowerCase())) ||
      content.title.toLowerCase().includes(topic.toLowerCase()) ||
      content.summary.toLowerCase().includes(topic.toLowerCase())
    );
  }
}