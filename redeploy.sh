#!/bin/bash

echo "🔨 Rebuilding frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend rebuild successful!"
    echo ""
    echo "📤 Next steps:"
    echo "1. Commit changes: git add -A && git commit -m 'Add HB score display'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Vercel/Render will auto-deploy the new build"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
