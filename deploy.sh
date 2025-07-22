#!/bin/bash

echo "🚀 LeadGen.to Direct Vercel Deployment"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel@latest
fi

echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Run: vercel"
    echo "2. Follow prompts to deploy"
    echo "3. Set custom domain: leadgen.to"
    echo ""
    echo "Environment variables needed:"
    echo "- ANTHROPIC_API_KEY"
    echo "- OPENAI_API_KEY" 
    echo "- DATABASE_URL"
    echo ""
    echo "Files ready in dist/ directory:"
    ls -la dist/
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi