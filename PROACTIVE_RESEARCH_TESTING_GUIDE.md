# Dr. Sakura Proactive Research System - Testing Guide

## Step-by-Step Testing Instructions

### Step 1: Access the BrezCode Chat Interface
1. Open your browser and go to the application
2. Navigate to **BrezCode** → **Dr. Sakura Chat** 
3. You'll see the chat interface with Dr. Sakura

### Step 2: Test the Proactive Research Controls
In the chat header, you'll see two buttons:

#### A. Start Proactive Research
1. Click the **"▶ Start Research"** button
2. You should see:
   - Button changes to **"⏸ Stop Research"** (red)
   - Green status bar appears: "Proactive research delivery active - Dr. Sakura will share expert insights every 2 minutes"
   - System starts delivering content automatically

#### B. Send Specific Dr. Rhonda Patrick Content
1. Click the **"🔬 Dr. Patrick"** button 
2. Dr. Sakura will immediately send research content from Dr. Rhonda Patrick
3. You'll see a message with:
   - Research summary and findings
   - Educational images
   - Video links to expert content
   - Resource links

### Step 3: Wait for Automatic Content Delivery
Once research is started:
1. **First message**: Arrives after 30 seconds
2. **Subsequent messages**: Every 2 minutes automatically
3. Each message includes:
   - Expert research summary
   - Key findings (bullet points)
   - Images from health experts
   - Video links with duration
   - Source links

### Step 4: Test Regular Chat with Multimedia
1. Type a health question like: "Tell me about breast health and nutrition"
2. Press Enter or click Send
3. Dr. Sakura responds with:
   - Comprehensive health guidance
   - Multimedia content (images, resources)
   - Quality scores (empathy, medical accuracy)

### Step 5: Stop Proactive Research
1. Click the **"⏸ Stop Research"** button (red)
2. Button changes back to **"▶ Start Research"** (outline)
3. Green status bar disappears
4. Automatic delivery stops

## What You Should See

### Proactive Research Messages Include:
- **Expert Name**: Dr. Rhonda Patrick, Dr. David Sinclair, Dr. Peter Attia, Dr. Sara Gottfried
- **Research Title**: "The Science of Longevity", "Hormone Balance", etc.
- **Summary**: Key research findings and implications
- **Key Findings**: Bullet-point list of discoveries
- **Multimedia Content**:
  - Educational images (300x200px thumbnails)
  - Video links with duration (e.g., "Watch: 42:15")
  - Source links (FoundMyFitness, Lifespan Podcast, etc.)

### Expected Expert Content Examples:

#### Dr. Rhonda Patrick Content:
- Topic: Aging & nutrition, breast health, hormones
- Findings: Sulforaphane effects, omega-3 benefits, time-restricted eating
- Videos: FoundMyFitness research presentations

#### Dr. David Sinclair Content:
- Topic: Longevity, anti-aging, cellular repair
- Findings: NAD+ decline, resveratrol effects, autophagy
- Videos: Lifespan Podcast episodes

#### Dr. Peter Attia Content:
- Topic: Women's health, hormone optimization
- Findings: HRT benefits, strength training, sleep impact
- Videos: The Drive Podcast episodes

## Testing Checklist

- [ ] Chat interface loads properly
- [ ] Start Research button works
- [ ] Status indicator appears when active
- [ ] Dr. Patrick button sends immediate content
- [ ] First proactive message arrives (30 seconds)
- [ ] Subsequent messages arrive every 2 minutes
- [ ] Messages include multimedia content
- [ ] Regular chat still works with multimedia
- [ ] Stop Research button works
- [ ] Status indicator disappears when stopped

## Troubleshooting

**If buttons don't work:**
- Check browser console for errors
- Refresh the page and try again

**If no proactive messages arrive:**
- Check the server console logs
- Verify the system status shows "Active"

**If multimedia doesn't display:**
- Check MultimediaMessage component is working
- Verify images load properly

## Advanced Testing

### Backend API Testing (Optional):
You can also test the API directly:

```bash
# Start proactive research
curl -X POST http://localhost:5000/api/brezcode/avatar/dr-sakura/start-proactive-research \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "intervalMinutes": 2}'

# Check status
curl -X GET http://localhost:5000/api/brezcode/avatar/dr-sakura/proactive-status/1

# Send specific research
curl -X POST http://localhost:5000/api/brezcode/avatar/dr-sakura/send-research \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "researcherName": "Dr. Rhonda Patrick"}'

# Stop proactive research
curl -X POST http://localhost:5000/api/brezcode/avatar/dr-sakura/stop-proactive-research \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

## Expected Results Summary

✅ **System Active**: Proactive research runs every 2 minutes
✅ **Expert Content**: 4 KOL researchers with 5 research items  
✅ **Multimedia Support**: Images, videos, and links in each message
✅ **Manual Controls**: Start/stop and instant Dr. Patrick content
✅ **Quality Integration**: Empathy and medical accuracy scoring
✅ **Chat Enhancement**: Regular chat includes multimedia content

The system successfully delivers research insights from leading health experts with multimedia content as requested!