#!/usr/bin/env bash
set -ex
printenv
NEARLIB_DIR="$(npm prefix)"
NEARCORE_DIR="${NEARCORE_DIR:-../nearcore}"
echo "NEARCORE_DIR ${NEARLIB_DIR}"
"$(npm bin)"/pbjs \
	-t static-module \
	-w commonjs \
	-o ${NEARLIB_DIR}/protos.js \
	${NEARCORE_DIR}/runtime/protos/protos/signed_transaction.proto
