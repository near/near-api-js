#!/usr/bin/env bash

# Setup script for near-sandbox binary
# This script downloads and installs the near-sandbox binary for e2e tests

set -e

SANDBOX_VERSION="${SANDBOX_VERSION:-1.38.0}"
SANDBOX_COMMIT="${SANDBOX_COMMIT:-aac5e42fe8975e27faca53e31f53f9c67a5b4e35}"
PLATFORM=$(uname -s)
ARCH=$(uname -m)

# Determine platform-specific binary
if [ "$PLATFORM" = "Linux" ] && [ "$ARCH" = "x86_64" ]; then
    PLATFORM_ARCH="Linux-x86_64"
elif [ "$PLATFORM" = "Darwin" ] && [ "$ARCH" = "x86_64" ]; then
    PLATFORM_ARCH="Darwin-x86_64"
elif [ "$PLATFORM" = "Darwin" ] && [ "$ARCH" = "arm64" ]; then
    PLATFORM_ARCH="Darwin-arm64"
else
    echo "Unsupported platform: $PLATFORM $ARCH"
    exit 1
fi

INSTALL_DIR="${HOME}/.near/sandbox"
mkdir -p "$INSTALL_DIR"

echo "Installing near-sandbox for $PLATFORM_ARCH..."

# Try multiple sources
URLS=(
    "https://s3-us-west-1.amazonaws.com/build.nearprotocol.com/nearcore/${PLATFORM_ARCH}/${SANDBOX_VERSION}/${SANDBOX_COMMIT}/near-sandbox.tar.gz"
    "https://github.com/near/nearcore/releases/download/${SANDBOX_VERSION}/near-sandbox-${PLATFORM_ARCH}.tar.gz"
)

# Try each URL
for URL in "${URLS[@]}"; do
    echo "Trying to download from: $URL"
    if curl -L -o /tmp/near-sandbox.tar.gz "$URL" 2>/dev/null; then
        if tar -tzf /tmp/near-sandbox.tar.gz >/dev/null 2>&1; then
            echo "Successfully downloaded from: $URL"
            tar -xzf /tmp/near-sandbox.tar.gz -C "$INSTALL_DIR" --strip-components=1
            rm /tmp/near-sandbox.tar.gz
            chmod +x "$INSTALL_DIR/near-sandbox"
            echo "near-sandbox installed successfully to $INSTALL_DIR/near-sandbox"
            exit 0
        fi
    fi
done

echo "ERROR: Failed to download near-sandbox from any source."
echo ""
echo "Please try one of the following:"
echo "1. Set SANDBOX_ARTIFACT_URL environment variable to a valid download URL"
echo "2. Manually download and place the binary in $INSTALL_DIR/near-sandbox"
echo "3. Build from source: https://github.com/near/nearcore"
exit 1
