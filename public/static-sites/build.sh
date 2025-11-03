#!/usr/bin/env bash
set -e  # Stop on any error

echo ">>> Starting custom build + copy process..."

# Step 1: Run build
npm run build

echo ">>> Build finished. Now creating folders in dist..."

# Step 2: Ensure destination folders exist inside dist
mkdir -p ./dist/get ./dist/go ./dist/connect ./dist/checkin

echo ">>> Folders created. Copying files now..."

# Step 3: Copy from public/_common to dist subfolders
cp -R ./public/_common/* ./dist/get/ || echo "copy to get failed"
cp -R ./public/_common/* ./dist/go/ || echo "copy to go failed"
cp -R ./public/_common/* ./dist/connect/ || echo "copy to connect failed"
cp -R ./public/_common/* ./dist/checkin/ || echo "copy to checkin failed"

echo ">>> Copy process complete!"
