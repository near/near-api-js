#!/bin/bash

git clone https://github.com/maxhr/near-api-js-docs.git ./builder
cd builder
yarn install
yarn build
