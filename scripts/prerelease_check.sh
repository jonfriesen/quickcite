#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq to run this script."
    exit 1
fi

# Function to extract version from JSON files using jq
get_json_version() {
    jq -r '.version' "$1"
}

# Get the current git tag
git_tag=$(git describe --tags --abbrev=0)

# Get the version from package.json
package_version=$(get_json_version "./package.json")

# Get the version from manifest.json
manifest_version=$(get_json_version "./manifest.json")

# Get the version from dist/manifest.json
dist_manifest_version=$(get_json_version "./dist/manifest.json")

# Get the commit hash of the current tag
tag_commit=$(git rev-list -n 1 $git_tag)

# Get the current commit hash
current_commit=$(git rev-parse HEAD)

# Check if all versions match
if [ "$git_tag" = "$package_version" ] && [ "$git_tag" = "$manifest_version" ] && [ "$git_tag" = "$dist_manifest_version" ]; then
    echo "Version check passed: All versions match ($git_tag)"
else
    echo "Version check failed: Versions do not match"
    echo "Git tag: $git_tag"
    echo "package.json: $package_version"
    echo "manifest.json: $manifest_version"
    echo "dist/manifest.json: $dist_manifest_version"
    exit 1
fi

# Check if the current commit matches the tag commit
if [ "$tag_commit" = "$current_commit" ]; then
    echo "Commit check passed: Current commit matches tag commit"
else
    echo "Commit check failed: Current commit does not match tag commit"
    echo "Tag commit: $tag_commit"
    echo "Current commit: $current_commit"
    exit 1
fi

echo "All checks passed successfully!"