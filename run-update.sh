#!/bin/bash

echo "Running Project Kelmah autonomous development workflow updates..."

echo "1. Running feature validation..."
node scripts/feature-validation.js

echo "2. Updating autonomous development workflow..."
node scripts/update-autonomous-dev.js

echo "3. Identifying test needs..."
node scripts/identify-test-needs.js

echo "Workflow update complete! The following files have been generated:"
echo "- ai-proposals/validated-progress.json"
echo "- ai-proposals/feature-validation-report.md"
echo "- ai-proposals/test-priorities.md"
echo "- ai-proposals/progress-report.md (updated)"

echo ""
echo "You can run tests with: npm test"
echo "" 