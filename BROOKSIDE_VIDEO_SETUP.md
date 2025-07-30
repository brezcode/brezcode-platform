# Brookside Associates Video Setup Guide

## Current Status
✅ **Video Player Infrastructure Complete**
- HTML5 video player with mobile optimization
- `playsInline` attribute for proper mobile playback
- Responsive aspect ratio container
- Professional video controls

## To Complete Video Integration:

### Option 1: Contact Brookside Associates (Recommended)
1. **Email**: Contact Brookside Associates directly for educational licensing
   - Website: https://brooksidepress.org/brooksidepress/
   - Request permission to use their 5-minute breast self-exam video
   - Explain this is for a medical education platform (Dr. Sakura health coaching)

2. **Educational Use License**: Most medical institutions provide videos for educational platforms
   - Mention this is for patient education, not commercial use
   - Reference the video quality and medical accuracy you observed

### Option 2: Screen Recording (Temporary Solution)
1. Visit: https://brooksidepress.org/brooksidepress/?page_id=103
2. Use screen recording software to capture the 5-minute video
3. Save as MP4 format with good quality (720p minimum)
4. Replace the placeholder file: `public/videos/demo_breast_self_exam.mp4`

### Option 3: Alternative Medical Videos
Search for equivalent quality medical videos with clear licensing:
- American College of Obstetricians and Gynecologists 
- National Cancer Institute educational videos
- Medical school educational content with open licensing

## Technical Implementation Ready ✅

The system now supports:
- **Mobile-First Video Player**: `playsInline` prevents fullscreen takeover on mobile
- **Responsive Design**: Aspect ratio containers work on all screen sizes
- **Professional Controls**: Standard video controls with download protection
- **Accessibility**: Caption support ready (`<track>` element included)
- **Performance**: `preload="metadata"` for faster loading

## File Locations:
- Video file: `public/videos/demo_breast_self_exam.mp4` (replace this)
- Video service: `server/services/multimediaContentService.ts` 
- Video player: `client/src/components/MultimediaMessage.tsx`

## Testing:
Once you have the actual video file:
1. Replace `public/videos/demo_breast_self_exam.mp4` with the real video
2. Ask Dr. Sakura about "self-exam" 
3. Video should play directly in the pink dialogue box
4. Test on mobile device to confirm `playsInline` works correctly