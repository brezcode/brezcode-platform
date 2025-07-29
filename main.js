const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Simple health report generation
app.post('/api/reports/generate', (req, res) => {
  const answers = req.body;
  
  // Simple risk calculation
  let riskScore = 20;
  let riskFactors = [];
  
  if (parseInt(answers.age) >= 50) {
    riskScore += 20;
    riskFactors.push("Age over 50 increases breast cancer risk");
  }
  
  if (answers.family_history === "Yes") {
    riskScore += 25;
    riskFactors.push("Family history of breast cancer");
  }
  
  if (parseFloat(answers.bmi) >= 30) {
    riskScore += 15;
    riskFactors.push("Obesity increases breast cancer risk");
  }
  
  if (answers.exercise === "No, little or no regular exercise") {
    riskScore += 10;
    riskFactors.push("Lack of regular exercise");
  }
  
  const report = {
    id: Date.now(),
    riskScore: Math.min(riskScore, 100),
    riskCategory: riskScore >= 60 ? 'high' : riskScore >= 40 ? 'moderate' : 'low',
    riskFactors,
    recommendations: [
      "Schedule annual mammograms starting at age 40",
      "Maintain a healthy weight through balanced diet and regular exercise",
      "Perform monthly breast self-examinations",
      "Consult with your healthcare provider about your risk factors",
      "Consider genetic counseling if family history is present"
    ],
    dailyPlan: {
      morning: "Take vitamin D supplement and practice 10 minutes of meditation",
      afternoon: "30 minutes of physical activity (walking, swimming, or yoga)", 
      evening: "Practice stress reduction techniques and maintain healthy sleep schedule (7-8 hours)"
    }
  };
  
  res.json({ success: true, report });
});

// Serve the main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Breast Health Assessment Platform | BrezCode</title>
      <meta name="description" content="Evidence-based breast health assessment with personalized risk analysis and wellness recommendations.">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          min-height: 100vh; 
        }
        .container { 
          max-width: 900px; 
          margin: 0 auto; 
          padding: 20px; 
          background: white; 
          margin-top: 20px; 
          margin-bottom: 20px; 
          border-radius: 15px; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.1); 
        }
        .header { 
          text-align: center; 
          padding: 40px 0; 
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
          margin: -20px -20px 40px -20px; 
          border-radius: 15px 15px 0 0; 
          color: white; 
        }
        .header h1 { 
          font-size: 2.5rem; 
          margin-bottom: 10px; 
          font-weight: 700; 
        }
        .header p { 
          font-size: 1.1rem; 
          opacity: 0.9; 
        }
        .statistic { 
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); 
          padding: 30px; 
          border-radius: 12px; 
          margin: 30px 0; 
          text-align: center; 
          border-left: 6px solid #ff6b6b; 
          box-shadow: 0 8px 25px rgba(255,107,107,0.2); 
        }
        .statistic h2 { 
          font-size: 1.8rem; 
          margin-bottom: 10px; 
          color: #2c3e50; 
          font-weight: 600; 
        }
        .statistic p { 
          font-size: 1.1rem; 
          color: #34495e; 
          font-style: italic; 
        }
        .cta-button { 
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); 
          color: #2c3e50; 
          padding: 18px 40px; 
          border: none; 
          border-radius: 30px; 
          font-size: 1.2rem; 
          font-weight: bold; 
          cursor: pointer; 
          margin: 25px 0; 
          transition: all 0.3s ease; 
          box-shadow: 0 8px 20px rgba(255,215,0,0.3); 
          display: block; 
          margin-left: auto; 
          margin-right: auto; 
        }
        .cta-button:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 12px 25px rgba(255,215,0,0.4); 
        }
        .quiz-form { 
          background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); 
          padding: 40px; 
          border-radius: 15px; 
          margin-top: 30px; 
          border: 2px solid #e3e8ff; 
        }
        .quiz-form h3 { 
          text-align: center; 
          margin-bottom: 30px; 
          color: #2c3e50; 
          font-size: 1.8rem; 
        }
        .form-group { 
          margin: 25px 0; 
        }
        .form-group label { 
          display: block; 
          margin-bottom: 8px; 
          font-weight: 600; 
          color: #34495e; 
          font-size: 1.1rem; 
        }
        .form-group input, .form-group select { 
          width: 100%; 
          padding: 15px; 
          border: 2px solid #e1e8f0; 
          border-radius: 8px; 
          font-size: 1rem; 
          transition: border-color 0.3s ease; 
        }
        .form-group input:focus, .form-group select:focus { 
          outline: none; 
          border-color: #667eea; 
          box-shadow: 0 0 0 3px rgba(102,126,234,0.1); 
        }
        .results { 
          background: linear-gradient(135deg, #e8f5e8 0%, #f0fdf0 100%); 
          padding: 40px; 
          border-radius: 15px; 
          margin-top: 30px; 
          border: 2px solid #bbf7d0; 
        }
        .results h3 { 
          color: #166534; 
          margin-bottom: 20px; 
          font-size: 1.8rem; 
        }
        .risk-score { 
          background: white; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 20px 0; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
        }
        .recommendations { 
          background: white; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 20px 0; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
        }
        .recommendations h4 { 
          color: #059669; 
          margin-bottom: 15px; 
          font-size: 1.3rem; 
        }
        .recommendations ul { 
          padding-left: 20px; 
        }
        .recommendations li { 
          margin: 10px 0; 
          font-size: 1rem; 
        }
        .daily-plan { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap: 20px; 
          margin-top: 25px; 
        }
        .plan-item { 
          background: white; 
          padding: 20px; 
          border-radius: 10px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
        }
        .plan-item h5 { 
          color: #0f766e; 
          margin-bottom: 10px; 
          font-size: 1.2rem; 
        }
        @media (max-width: 768px) { 
          .container { margin: 10px; padding: 15px; } 
          .header h1 { font-size: 2rem; } 
          .quiz-form, .results { padding: 25px; } 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🩺 Breast Health Assessment</h1>
          <p>Evidence-Based Risk Analysis & Personalized Wellness</p>
        </div>
        
        <div class="statistic">
          <h2>"1 in 8 women in US will develop breast cancer in their lifetime"</h2>
          <p>— World Health Organization</p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <p style="font-size: 1.2rem; color: #2c3e50; margin-bottom: 20px;">
            Take our comprehensive assessment to understand your personal risk factors and receive evidence-based recommendations for optimal breast health.
          </p>
          <button class="cta-button" onclick="showQuiz()">🔍 Start Your Assessment</button>
        </div>
        
        <div id="quiz" class="quiz-form" style="display: none;">
          <h3>📋 Comprehensive Health Assessment</h3>
          <form id="assessmentForm">
            <div class="form-group">
              <label>👤 Age:</label>
              <input type="number" name="age" required min="18" max="100" placeholder="Enter your age">
            </div>
            <div class="form-group">
              <label>👨‍👩‍👧‍👦 Family History of Breast Cancer:</label>
              <select name="family_history" required>
                <option value="">Please select...</option>
                <option value="Yes">Yes - immediate family member (mother, sister, daughter)</option>
                <option value="No">No known family history</option>
              </select>
            </div>
            <div class="form-group">
              <label>⚖️ Current Weight (kg):</label>
              <input type="number" name="weight" required min="30" max="200" placeholder="Enter weight in kilograms">
            </div>
            <div class="form-group">
              <label>📏 Height (meters):</label>
              <input type="number" name="height" step="0.01" required min="1.0" max="2.5" placeholder="e.g., 1.65">
            </div>
            <div class="form-group">
              <label>🏃‍♀️ Exercise Habits:</label>
              <select name="exercise" required>
                <option value="">Please select...</option>
                <option value="Yes, regular exercise">Yes - Regular exercise (3+ times per week)</option>
                <option value="No, little or no regular exercise">No - Little or no regular exercise</option>
              </select>
            </div>
            <button type="submit" class="cta-button">📊 Generate My Health Report</button>
          </form>
        </div>
        
        <div id="results" class="results" style="display: none;"></div>
      </div>
      
      <script>
        function showQuiz() {
          document.getElementById('quiz').style.display = 'block';
          document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
        }
        
        document.getElementById('assessmentForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const answers = Object.fromEntries(formData.entries());
          
          // Calculate BMI
          const height = parseFloat(answers.height);
          const weight = parseFloat(answers.weight);
          answers.bmi = (weight / (height * height)).toFixed(1);
          
          try {
            const response = await fetch('/api/reports/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(answers)
            });
            
            const data = await response.json();
            
            if (data.success) {
              const report = data.report;
              const riskColor = report.riskCategory === 'high' ? '#dc2626' : 
                               report.riskCategory === 'moderate' ? '#d97706' : '#059669';
              
              document.getElementById('results').innerHTML = \`
                <h3>📋 Your Personalized Health Report</h3>
                
                <div class="risk-score">
                  <h4 style="color: \${riskColor};">Risk Assessment</h4>
                  <p style="font-size: 1.4rem; font-weight: bold; color: \${riskColor};">
                    Risk Score: \${report.riskScore}/100 (\${report.riskCategory.toUpperCase()} risk)
                  </p>
                  <p><strong>BMI:</strong> \${answers.bmi} kg/m²</p>
                </div>
                
                \${report.riskFactors.length > 0 ? \`
                <div class="recommendations">
                  <h4>⚠️ Identified Risk Factors:</h4>
                  <ul>\${report.riskFactors.map(factor => '<li>' + factor + '</li>').join('')}</ul>
                </div>
                \` : ''}
                
                <div class="recommendations">
                  <h4>💡 Personalized Recommendations:</h4>
                  <ul>\${report.recommendations.map(rec => '<li>' + rec + '</li>').join('')}</ul>
                </div>
                
                <div class="recommendations">
                  <h4>🌅 Daily Wellness Plan:</h4>
                  <div class="daily-plan">
                    <div class="plan-item">
                      <h5>🌅 Morning</h5>
                      <p>\${report.dailyPlan.morning}</p>
                    </div>
                    <div class="plan-item">
                      <h5>🌞 Afternoon</h5>
                      <p>\${report.dailyPlan.afternoon}</p>
                    </div>
                    <div class="plan-item">
                      <h5>🌙 Evening</h5>
                      <p>\${report.dailyPlan.evening}</p>
                    </div>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 10px;">
                  <p style="font-weight: bold; color: #92400e;">
                    ⚠️ Important: This assessment is for educational purposes only. 
                    Please consult with your healthcare provider for personalized medical advice.
                  </p>
                </div>
              \`;
              document.getElementById('results').style.display = 'block';
              document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            }
          } catch (error) {
            alert('❌ Error generating report. Please try again.');
            console.error('Error:', error);
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Breast Health Platform running on port ${PORT}`);
  console.log(`📱 Access your app at: http://localhost:${PORT}`);
  console.log(`🌐 Your Replit URL: https://breasthealthmigrate-brezcode2024.replit.dev/`);
});