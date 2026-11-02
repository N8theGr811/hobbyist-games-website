#!/bin/sh
# Compile the pure attribution helpers into a disposable directory and test them.
set -eu
cd "$(dirname "$0")/.."
test_build=$(mktemp -d)
trap 'rm -rf "$test_build"' EXIT
./node_modules/.bin/tsc src/lib/campaign.ts --target es2020 --module commonjs --outDir "$test_build" --skipLibCheck
CAMPAIGN_TEST_BUILD="$test_build" node --test tests/campaign.test.cjs
