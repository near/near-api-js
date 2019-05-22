#!/usr/bin/env bash
set -ex
NEARLIB_DIR="$(npm prefix)"
NEAR_PROTOS_DIR="${NEAR_PROTOS_DIR:-../nearcore/runtime/protos/protos}"
"$(npm bin)"/pbjs \
	-t static-module \
	-w commonjs \
	-o ${NEARLIB_DIR}/protos.js \
	${NEAR_PROTOS_DIR}/signed_transaction.proto
