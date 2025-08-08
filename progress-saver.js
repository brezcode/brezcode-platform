const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProgressSaver {
  static async saveProgress(operation, data = {}) {
    const timestamp = new Date().toISOString();
    const progressFile = path.join(__dirname, '.progress.json');
    
    try {
      // Save progress data
      const progress = {
        operation,
        timestamp,
        data,
        completed: false
      };
      
      fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
      console.log(`📝 Progress saved for: ${operation}`);
      
      // Auto-commit checkpoint
      exec('./checkpoint.sh', (error, stdout, stderr) => {
        if (error) {
          console.log('⚠️ Checkpoint failed:', error.message);
        } else {
          console.log('✅ Checkpoint created');
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to save progress:', error.message);
    }
  }
  
  static async markCompleted(operation) {
    const progressFile = path.join(__dirname, '.progress.json');
    
    try {
      if (fs.existsSync(progressFile)) {
        const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
        if (progress.operation === operation) {
          progress.completed = true;
          progress.completedAt = new Date().toISOString();
          fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
          console.log(`✅ Operation completed: ${operation}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to mark completed:', error.message);
    }
  }
  
  static getLastProgress() {
    const progressFile = path.join(__dirname, '.progress.json');
    try {
      if (fs.existsSync(progressFile)) {
        return JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      }
    } catch (error) {
      console.error('❌ Failed to read progress:', error.message);
    }
    return null;
  }
}

module.exports = { ProgressSaver };