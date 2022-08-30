#!/bin/bash

git clone https://github.com/maxhr/near-api-js-docs.git ./builder
cd builder
yarn install

export DOCS_ENTRY_POINT=../../packages/near-api-js/src
export DOCS_TS_CONFIG=../../packages/near-api-js/tsconfig.json
export DOCS_BASE_PATH=../../packages/near-api-js/src
export DOCS_README=../README_TYPEDOC.md

yarn build