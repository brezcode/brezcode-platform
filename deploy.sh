#!/bin/bash

# Deploy leadgen.to to Vercel
echo "Deploying leadgen.to platform..."

# Ensure build is complete
npm run build

# Create .vercelignore
cat > .vercelignore << EOF
node_modules
.git
*.log
.env.local
.replit
.gitignore
EOF

# Try automated deployment
echo "Build complete. Ready for Vercel deployment."
echo "Manual deployment required via Vercel dashboard or CLI authentication."
echo "Files ready in dist/ directory."