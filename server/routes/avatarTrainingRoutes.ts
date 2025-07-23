import { Router } from 'express';
import { AVATAR_TYPES, TRAINING_SCENARIOS, getScenariosByAvatarType, getScenariosByDifficulty, getAvatarTypeById } from '../avatarTrainingScenarios';

const router = Router();

// Get all avatar types
router.get('/avatar-types', (req, res) => {
  try {
    res.json({
      success: true,
      avatarTypes: AVATAR_TYPES,
      totalTypes: AVATAR_TYPES.length
    });
  } catch (error) {
    console.error('Error fetching avatar types:', error);
    res.status(500).json({ error: 'Failed to fetch avatar types' });
  }
});

// Get specific avatar type details
router.get('/avatar-types/:id', (req, res) => {
  try {
    const { id } = req.params;
    const avatarType = getAvatarTypeById(id);
    
    if (!avatarType) {
      return res.status(404).json({ error: 'Avatar type not found' });
    }
    
    const scenarios = getScenariosByAvatarType(id);
    
    res.json({
      success: true,
      avatarType,
      scenarios,
      scenarioCount: scenarios.length
    });
  } catch (error) {
    console.error('Error fetching avatar type:', error);
    res.status(500).json({ error: 'Failed to fetch avatar type details' });
  }
});

// Get all training scenarios
router.get('/scenarios', (req, res) => {
  try {
    const { avatarType, difficulty, industry } = req.query;
    
    let filteredScenarios = TRAINING_SCENARIOS;
    
    if (avatarType) {
      filteredScenarios = filteredScenarios.filter(s => s.avatarType === avatarType);
    }
    
    if (difficulty) {
      filteredScenarios = filteredScenarios.filter(s => s.difficulty === difficulty);
    }
    
    if (industry) {
      filteredScenarios = filteredScenarios.filter(s => s.industry === industry);
    }
    
    res.json({
      success: true,
      scenarios: filteredScenarios,
      totalScenarios: filteredScenarios.length
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch training scenarios' });
  }
});

// Get specific scenario details
router.get('/scenarios/:id', (req, res) => {
  try {
    const { id } = req.params;
    const scenario = TRAINING_SCENARIOS.find(s => s.id === id);
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    const avatarType = getAvatarTypeById(scenario.avatarType);
    
    res.json({
      success: true,
      scenario,
      avatarType
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario details' });
  }
});

// Get training recommendations based on avatar type and skill level
router.get('/recommendations/:avatarType', (req, res) => {
  try {
    const { avatarType } = req.params;
    const { skillLevel = 'beginner' } = req.query;
    
    const avatar = getAvatarTypeById(avatarType);
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar type not found' });
    }
    
    // Get scenarios appropriate for skill level
    const scenarios = getScenariosByAvatarType(avatarType);
    const recommendedScenarios = scenarios.filter(s => {
      if (skillLevel === 'beginner') return s.difficulty === 'beginner';
      if (skillLevel === 'intermediate') return ['beginner', 'intermediate'].includes(s.difficulty);
      return true; // advanced gets all
    });
    
    // Create training path recommendation
    const trainingPath = {
      avatarType: avatar,
      skillLevel,
      recommendedScenarios: recommendedScenarios.slice(0, 5), // Top 5 recommendations
      totalAvailableScenarios: scenarios.length,
      estimatedTrainingTime: recommendedScenarios.reduce((total, scenario) => total + scenario.timeframeMins, 0),
      keySkillsToFocus: avatar.primarySkills.slice(0, 3)
    };
    
    res.json({
      success: true,
      trainingPath
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate training recommendations' });
  }
});

// Get industry-specific training options
router.get('/industry-training/:industry', (req, res) => {
  try {
    const { industry } = req.params;
    
    // Find avatar types that support this industry
    const relevantAvatars = AVATAR_TYPES.filter(avatar => 
      avatar.industries.some(ind => ind.toLowerCase().includes(industry.toLowerCase()))
    );
    
    // Find scenarios for this industry
    const industryScenarios = TRAINING_SCENARIOS.filter(scenario => 
      scenario.industry.toLowerCase().includes(industry.toLowerCase())
    );
    
    res.json({
      success: true,
      industry,
      relevantAvatars,
      industryScenarios,
      trainingOptions: {
        avatarTypes: relevantAvatars.length,
        availableScenarios: industryScenarios.length,
        difficultyLevels: [...new Set(industryScenarios.map(s => s.difficulty))],
        estimatedTotalTime: industryScenarios.reduce((total, scenario) => total + scenario.timeframeMins, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching industry training:', error);
    res.status(500).json({ error: 'Failed to fetch industry training options' });
  }
});

// Create custom scenario (for advanced users)
router.post('/scenarios/custom', (req, res) => {
  try {
    const {
      avatarType,
      name,
      description,
      customerPersona,
      customerMood,
      objectives,
      timeframeMins,
      difficulty,
      industry
    } = req.body;
    
    // Validate required fields
    if (!avatarType || !name || !description || !customerPersona) {
      return res.status(400).json({ 
        error: 'Missing required fields: avatarType, name, description, customerPersona' 
      });
    }
    
    // Validate avatar type exists
    const avatar = getAvatarTypeById(avatarType);
    if (!avatar) {
      return res.status(400).json({ error: 'Invalid avatar type' });
    }
    
    // Create custom scenario
    const customScenario = {
      id: `custom_${Date.now()}`,
      avatarType,
      name,
      description,
      customerPersona,
      customerMood: customerMood || 'neutral',
      objectives: objectives || [],
      timeframeMins: timeframeMins || 15,
      difficulty: difficulty || 'intermediate',
      tags: ['custom'],
      industry: industry || 'General',
      successCriteria: [],
      commonMistakes: [],
      keyLearningPoints: []
    };
    
    res.json({
      success: true,
      scenario: customScenario,
      message: 'Custom scenario created successfully'
    });
  } catch (error) {
    console.error('Error creating custom scenario:', error);
    res.status(500).json({ error: 'Failed to create custom scenario' });
  }
});

export default router;