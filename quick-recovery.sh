# Quick Recovery Commands
# If Claude Code restarts, run these to restore context:

cat CLAUDE.md                    # Read project context
cat session-tracker.txt          # Check current task
git log --oneline -3             # See recent progress  
pwd && ls -la | head -10         # Confirm workspace location

# Then say: 'Continue with www.skincoach.ai domain setup'

