# Multi-Platform Deployment Guide

## Overview
This guide outlines the deployment strategy for the BrezCode multi-platform ecosystem using the "Copy-on-Need" architecture with complete platform isolation.

## 🚀 Deployment Strategy

### Phase 1: Current Repository (Shared Tools Laboratory)
This repository serves as the development and testing environment for shared tools.

**Purpose**: 
- Develop reusable components
- Test integration patterns
- Create deployment templates
- Document tool usage

**Deployment**: 
- **Platform**: Vercel (current)
- **Domain**: Direct Replit/Vercel URL for development
- **Database**: Development database for testing

### Phase 2: Individual Platform Deployments
Each platform will have its own dedicated deployment with copied tools.

## 🗄️ Database Deployment Strategy

### Production Database Setup
```bash
# Create separate databases for each platform
# BrezCode (Health Data - HIPAA Compliant)
CREATE DATABASE brezcode_production;

# SkinCoach (Skin Analysis - GDPR Compliant)  
CREATE DATABASE skincoach_production;

# LeadGen (Business Data - Standard Compliance)
CREATE DATABASE leadgen_production;

# Optional: Shared Services (Minimal)
CREATE DATABASE shared_auth_production;
CREATE DATABASE shared_logs_production;
```

### Environment Variables per Platform
```bash
# BrezCode Platform
BREZCODE_DB_URL=postgresql://user:pass@host/brezcode_production
BREZCODE_WA_ACCESS_TOKEN=your_brezcode_whatsapp_token
BREZCODE_ANTHROPIC_API_KEY=your_anthropic_key
BREZCODE_DOMAIN=www.brezcode.com

# SkinCoach Platform  
SKINCOACH_DB_URL=postgresql://user:pass@host/skincoach_production
SKINCOACH_WA_ACCESS_TOKEN=your_skincoach_whatsapp_token
SKINCOACH_AI_API_KEY=your_skin_analysis_api_key
SKINCOACH_DOMAIN=www.skincoach.ai

# LeadGen Platform
LEADGEN_DB_URL=postgresql://user:pass@host/leadgen_production
LEADGEN_WA_ACCESS_TOKEN=your_leadgen_whatsapp_token
LEADGEN_ANTHROPIC_API_KEY=your_anthropic_key
LEADGEN_DOMAIN=leadgen.to
```

## 🔧 Tool Copying Workflow

### 1. WhatsApp API Service
**Location**: `/server/services/multiPlatformWhatsAppService.ts`

**Copy to Platform**:
```bash
# Copy WhatsApp service to platform repository
cp server/services/multiPlatformWhatsAppService.ts ../brezcode-platform/server/services/
cp server/routes/whatsappRoutes.ts ../brezcode-platform/server/routes/

# Update platform-specific configuration
# Modify service to use platform-specific credentials
# Remove multi-platform logic, keep only needed functionality
```

**Platform Customization**:
- Remove unused platform configurations
- Update branding and messaging for specific platform
- Configure platform-specific phone numbers and tokens

This deployment strategy ensures complete platform independence while maximizing development efficiency through selective tool sharing.