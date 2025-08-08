#!/bin/bash
# Auto-checkpoint script for Replit
git add -A
git commit -m "Auto-checkpoint: $(date)" || echo "No changes to commit"
echo "Checkpoint created successfully"