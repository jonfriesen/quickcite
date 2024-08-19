#!/bin/bash

# Ensure that the script is executed with one argument (the version type or specific semver)
if [ -z "$1" ]; then
  echo "Usage: $0 [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease ]"
  exit 1
fi

# Check if the current branch is main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: You must be on the 'main' branch to bump the version."
  exit 1
fi

# Get the version type or specific version from the argument
VERSION_TYPE=$1

# Define a regex pattern for semver (e.g., 1.2.3 or 1.2.3-beta.1)
SEMVER_REGEX="^v?[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$"

# Check if the argument is a valid semver
if [[ $VERSION_TYPE =~ $SEMVER_REGEX ]]; then
  # Remove leading 'v' if present
  VERSION_TYPE=${VERSION_TYPE#v}

  # Validate that the version is in correct semver format
  if [[ ! $VERSION_TYPE =~ $SEMVER_REGEX ]]; then
    echo "Error: Version $VERSION_TYPE is not in valid semver format."
    exit 1
  fi

  # Bump the specific semver version without creating a git tag
  npm version $VERSION_TYPE --no-git-tag-version

else
  # If not semver, assume it's a version type like 'major', 'minor', etc.
  if [[ "$VERSION_TYPE" =~ ^(major|minor|patch|premajor|preminor|prepatch|prerelease)$ ]]; then
    # Bump the version with npm using the specified type
    npm version $VERSION_TYPE --no-git-tag-version
  else
    echo "Error: Invalid version type or format. Please provide a valid semver or one of: major, minor, patch, premajor, preminor, prepatch, prerelease."
    exit 1
  fi
fi

# Extract the new version from package.json
NEW_VERSION=$(node -p "require('./package.json').version")

# Update version in manifest.json
echo "Updating manifest.json..."
node -e "
  const fs = require('fs');
  const packageJson = require('./package.json');
  const manifestPath = './src/manifest.json';

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = packageJson.version;

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
"

# Commit the changes for package.json and manifest.json
echo "Committing changes..."
git add package.json src/manifest.json
git commit -m "Bump version to $NEW_VERSION"

# Create a new Git tag for the version
echo "Creating Git tag..."
git tag "v$NEW_VERSION"

# Ask if the user wants to push the changes now
read -p "Do you want to push the changes and tag to Git now? (y/N): " PUSH_NOW

if [[ $PUSH_NOW =~ ^[Yy]$ ]]; then
  # Push the changes and tag if the user agrees
  git push origin main --tags
  echo "Changes and tag v$NEW_VERSION have been pushed to the repository."
else
  # Output the commands if the user declines to push now
  echo "You can push the changes and the tag later by running the following commands:"
  echo "  git push origin main --tags"
  echo "This will push the changes on the main branch and the tag v$NEW_VERSION."
fi
