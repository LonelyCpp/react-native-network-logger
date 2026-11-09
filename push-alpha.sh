#!/bin/bash

# Extract version from package.json
VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
echo "Current version: $VERSION"

# Check if version contains "alpha"
if [[ $VERSION != *"-alpha."* ]]; then
  echo "Version is not an alpha release. Exiting."
  exit 1
fi

# Extract the base version and alpha number
BASE_VERSION=$(echo $VERSION | cut -d'-' -f1)
ALPHA_PART=$(echo $VERSION | cut -d'-' -f2)
ALPHA_PREFIX=$(echo $ALPHA_PART | cut -d'.' -f1)
ALPHA_NUMBER=$(echo $ALPHA_PART | cut -d'.' -f2)

# Increment alpha number
NEW_ALPHA_NUMBER=$((ALPHA_NUMBER + 1))
NEW_VERSION="$BASE_VERSION-$ALPHA_PREFIX.$NEW_ALPHA_NUMBER"

echo "New version: $NEW_VERSION"

# Update package.json with the new version
# Using perl for cross-platform compatibility with sed
perl -i -pe "s/\"version\": \"$VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# Push the new version to github
git add package.json
git commit -m "Bump version to $NEW_VERSION"
git push

# create a tag for the new version
git tag "v$NEW_VERSION"
git push origin "v$NEW_VERSION"
