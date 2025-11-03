#!/usr/bin/env bash
set -e

echo ">>> Starting custom build + copy process..."

# Step 1: Run main build
npm run build

echo ">>> Build finished. Now copying common assets..."

# Step 2: Ensure dist subfolders exist
mkdir -p ./dist/get ./dist/go ./dist/connect ./dist/checkin

# Step 3: Copy contents from public/_common into dist subfolders
cp -R ./public/_common/* ./dist/get/ || echo "copy to get failed"
cp -R ./public/_common/* ./dist/go/ || echo "copy to go failed"
cp -R ./public/_common/* ./dist/connect/ || echo "copy to connect failed"
cp -R ./public/_common/* ./dist/checkin/ || echo "copy to checkin failed"

echo ">>> Copy process complete!"
