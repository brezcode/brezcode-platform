# Claude Memory System - BrezCode Project

## Session Information
- **Project Start Date:** August 5, 2024 (User subscription date)
- **Current Session:** August 13, 2025
- **User:** Working on BrezCode multi-platform project
- **Main Goal:** Deploy BrezCode and SkinCoach as separate platforms

## Project Architecture Overview
- **Main Project:** BrezCode (multi-platform: BrezCode + SkinCoach + LeadGen)
- **Current Strategy:** Separate platforms for independent deployment
- **Target Domains:** 
  - brezcode.com (BrezCode platform)
  - skincoach.ai (SkinCoach platform)

## User Accounts & Setup
- **GitHub Account 1:** xynarghk (original repository: xynarghk/brezcode)
- **GitHub Account 2:** brezcode2024@gmail.com (new account for fresh deployment)
- **Vercel Account:** Connected to both GitHub accounts
- **Current Issue:** Vercel deployment conflicts with "functions/builds" error

## Key Decisions Made
1. **Platform Separation Strategy:** Deploy BrezCode and SkinCoach as separate applications
2. **Fresh Start Approach:** Use brezcode2024@gmail.com account to avoid cached conflicts
3. **Deployment Target:** Vercel for both platforms

## Current Project Status
### ✅ Completed:
- SkinCoach standalone project created at `/workspace/skincoach-standalone/`
- All SkinCoach components copied from main project
- SkinCoach server configuration completed
- BrezCode standalone project created at `/workspace/brezcode-standalone/`
- All SkinCoach components removed from BrezCode standalone
- BrezCode routing cleaned (removed SkinCoach imports and routes)

### ✅ Additional Completed:
- Created COMPLETE BrezCode platform at `/workspace/brezcode-complete/`
- Includes ALL features: health, business, AI training, avatar management, skin analysis
- Enhanced with LeadGen business tools and SkinCoach health analysis
- Clean server configuration with graceful route loading
- Successful build process (2.3MB client + 597KB server)
- Conflict-free vercel.json configuration

### 🔄 In Progress:
- Final deployment configuration and GitHub upload

### ❌ Deployment Issues Encountered:
- Persistent "functions property cannot be used in conjunction with builds property" error
- Tried multiple framework presets (Vite, Create React App, Other, Node.js)
- CLI deployment authentication issues

## Technical Architecture
```
Current Project Structure:
/workspace/
├── [main-brezcode-project]/ (multi-platform)
├── skincoach-standalone/ (✅ Ready)
└── [need-to-create: brezcode-standalone/]

Target Architecture:
brezcode.com ← BrezCode standalone
skincoach.ai ← SkinCoach standalone
```

## User Preferences & Working Style
- Prefers direct, concise answers
- Wants to focus on practical implementation
- Values efficiency and doesn't like repetitive explanations
- Expects me to remember previous decisions and context

## Next Immediate Actions
1. Create BrezCode standalone project (remove SkinCoach components)
2. Configure clean deployment setup for both platforms
3. Upload to GitHub under brezcode2024@gmail.com
4. Deploy to Vercel with proper domain configuration

---
**Memory Update Protocol:** I will update this file with every significant decision, progress, or change in our project.