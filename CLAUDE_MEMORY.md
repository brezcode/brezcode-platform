# Claude Memory System - BrezCode Project

## 🔥 CLAUDE PROTOCOL - READ THIS FIRST EVERY SESSION 🔥
**MANDATORY STEPS AT START OF EVERY SESSION:**
1. **READ CLAUDE_UNIVERSAL_PROTOCOL.md** - Universal working rules with Den
2. **READ SESSION_MANAGEMENT_PROTOCOL.md** - Session restart handling
3. **READ THIS ENTIRE MEMORY DOCUMENT** - Project-specific context
4. **READ STRATEGIC_MASTER_PLAN.md** - Complete architecture & roadmap
5. **Check "CRITICAL FAILURES" section** - Never retry failed approaches
6. **Review "CURRENT STATUS"** - Continue from exact point where last session ended
7. **Update memory after every major step** - Maintain continuity across restarts

## 🔄 REPLIT SESSION MANAGEMENT
**When credits run out and sessions restart:**
- **Den types "r"** → I immediately read all memory documents
- **I provide comprehensive summary:**
  - Highest level strategy overview
  - Current action plan and phase
  - What was completed in last session
  - What's pending and needs continuation
  - All todo items and what's left out
- **I act as smart consultant**: Propose ideas, guide strategically, think out of the box
- **I continue auto-updating**: Memory docs and strategic thinking throughout session

## ❌ CRITICAL FAILURES - NEVER RETRY THESE ❌
- **Vite Deployment to Vercel**: FAILED MULTIPLE TIMES - DO NOT SUGGEST AGAIN
- **CLI Vercel deployment**: Authentication issues - USE GITHUB IMPORT ONLY
- **Old project recovery**: Creates conflicts - ALWAYS START FRESH
- **Mixed framework configs**: Causes build errors - STICK TO ONE FRAMEWORK

## Session Information
- **Project Start Date:** August 5, 2024 (User subscription date)
- **Current Session:** August 15, 2025
- **User:** Working on BrezCode multi-platform project
- **Main Goal:** Deploy BrezCode and SkinCoach with proper domain routing

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
- Deployment to Vercel after Vite failures

### ❌ Deployment Issues Encountered:
- **Vite deployment FAILED multiple times on Vercel**
- Persistent "functions property cannot be used in conjunction with builds property" error
- Tried multiple framework presets (Vite, Create React App, Other, Node.js)
- CLI deployment authentication issues
- **CRITICAL DECISION: Abandoned Vite approach**

### ✅ Recent Major Progress:
- **Created Next.js version**: `/workspace/brezcode-nextjs-deploy/` 
- **Successfully converted Vite to Next.js**: Build works perfectly
- **Hybrid Architecture Decided**: 
  - Frontend: Vercel (Next.js) 
  - Backend: Railway (Express server)
- **GitHub Upload**: brezcode-frontend repository uploaded to GitHub

## 🎯 CURRENT STATUS - AUGUST 15, 2025
- **Architecture**: ✅ HYBRID - Vercel (Next.js Frontend) + Railway (Express Backend)
- **Current Platform**: ✅ Multiple working platforms available
- **Working Solutions**:
  - Main multi-platform system (root directory) - Production ready
  - BrezCode complete platform (brezcode-complete/) - Build tested
  - SkinCoach standalone (skincoach-standalone/) - Ready for deployment
  - Next.js version (brezcode-nextjs-deploy/) - Partially converted
- **CURRENT PHASE**: Platform deployment and domain configuration
- **ACTIVE TASK**: Domain setup for www.skincoach.ai routing to /skincoach
- **SESSION MGMT**: ✅ "r" trigger protocol established
- **CONSULTANT MODE**: ✅ Strategic guidance, out-of-box thinking, proactive proposals

## 📋 CURRENT TODO LIST - PLATFORM ENHANCEMENT
1. **✅ COMPLETED: Deploy www.brezcode.com** - LIVE and working
2. **Enhance deployed BrezCode with complete features** (ACTIVE)
3. **Deploy backend API to Railway** - PENDING
4. **Integrate complete health assessment quiz** - PENDING  
5. **Add admin dashboard functionality** - PENDING
6. **Deploy SkinCoach domain** - PENDING

## 🔥 WHAT USER WANTS - COMPLETE PLATFORM
- **Real 27-question medical assessment** (not fake demo)
- **Complete user journey**: Quiz → Signup → Dashboard → AI Coaching
- **Admin dashboard** for AI training, document uploads, operational tools
- **Multi-platform integration**: BrezCode + SkinCoach + LeadGen features
- **Backend operational link** to manage the entire BrezCode app

## 🏗️ COMPLETE PROJECT ARCHITECTURE
**See STRATEGIC_MASTER_PLAN.md for full details**

### Platforms
- **BrezCode**: Main health & business platform
- **SkinCoach**: Specialized skin analysis  
- **LeadGen**: Business lead generation

### Domains
- brezcode.com → Main platform
- skincoach.ai → Skin analysis
- leadgen.to → Business tools

### Architecture
- **Frontend**: Vercel (Next.js) - FREE
- **Backend**: Railway (Express.js + PostgreSQL) - $5/month
- **AI**: Claude + OpenAI APIs
- **Messaging**: WhatsApp Business API

## 🚀 MASTER ACTION PLAN
**Phase 1 (Current)**: Deploy & Domain Setup
**Phase 2**: WhatsApp AI Coaching Integration  
**Phase 3**: SEO & AI Agent Visibility
**Phase 4**: Social Media AI & Lead Generation

## 💰 CONSTRAINTS
- **Solo developer** (Den working alone)
- **Zero budget** (building/testing mode)
- **Free-tier maximization** strategy
- **MVP-first** approach for validation

## 📋 PROVEN WORKING METHODS
- **Framework**: Next.js (builds successfully)
- **Deployment**: GitHub → Vercel import (NOT CLI)
- **Architecture**: Frontend (Vercel) + Backend (Railway)

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

## 🔄 LAST SESSION UPDATE - AUGUST 15, 2025
- **Current Phase**: BrezCode Platform Deployment and Enhancement
- **Exact Status**: ✅ **www.brezcode.com IS LIVE** - Next.js deployment successful
- **Next Critical Action**: Enhance deployed BrezCode platform with complete features
- **Working Directory**: /home/runner/workspace/brezcode-nextjs-deploy (Next.js deployment)
- **Platform Status**: 
  - ✅ **LIVE**: www.brezcode.com (Next.js on Vercel) 
  - ✅ Working Next.js app with "BrezCode - AI-Powered Breast Health Platform"
  - Main system backup: Production ready at /home/runner/workspace
  - Complete platform components available for integration
- **SUCCESS**: BrezCode.com domain is deployed and accessible
- **Focus**: Upgrading deployed platform with complete BrezCode features

## 📚 MEMORY DOCUMENTS STATUS
- **CLAUDE_UNIVERSAL_PROTOCOL.md**: ✅ Read - Universal working rules with Den
- **SESSION_MANAGEMENT_PROTOCOL.md**: ✅ Read - Session restart handling 
- **STRATEGIC_MASTER_PLAN.md**: ✅ Read - Complete architecture & roadmap
- **DEPLOYMENT_CHECKPOINT.md**: ✅ Read - Fallback strategies available
- **RAILWAY_DEPLOY.md**: ✅ Read - Backend deployment guide

---
**Memory Update Protocol:** I will update this file with every significant decision, progress, or change in our project.