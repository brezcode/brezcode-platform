# Claude Code Context for SkinCoach Project

## Current Project Status
- This is a multi-platform application with SkinCoach, BrezCode, and LeadGen
- Working on linking www.skincoach.ai domain to SkinCoach landing page
- Current app runs at: https://workspace.brezcode2024.replit.dev
- Current IP: 34.57.6.37

## Current Task
Setting up www.skincoach.ai domain to point to /skincoach route

### DNS Configuration Needed
```
Type: CNAME
Name: www
Value: workspace.brezcode2024.replit.dev
TTL: 300
```

### Server Update Required
Need to add domain-specific routing in server/index.ts to redirect www.skincoach.ai visitors to /skincoach

## Key Routes
- `/skincoach` - SkinCoach landing page (already implemented)
- SkinCoach routes are in client/src/App.tsx:165-172
- Server runs on port 3000, exposed via Replit

## Important Files
- server/index.ts - Main server file
- client/src/pages/SkinCoachLanding.tsx - Landing page
- client/src/App.tsx - Route configuration

## Previous Context
User wants to link www.skincoach.ai domain to the existing SkinCoach landing page. The technical implementation is ready, just need DNS + server config.