#!/usr/bin/env bash
set -ex

NEAR_PROTOS_DIR="${NEAR_PROTOS_DIR:-../nearcore/core/protos/protos}"
NEARLIB_DIR="$(npm prefix)"
PROTOC_GEN_TS_PATH="$(npm bin)/protoc-gen-ts"

pbjs \
	-t static-module \
 	${NEAR_PROTOS_DIR}/signed_transaction.proto \
	 ${NEAR_PROTOS_DIR}/wrappers.proto \
	 ${NEAR_PROTOS_DIR}/uint128.proto \
	 ${NEAR_PROTOS_DIR}/access_key.proto \
	 | pbts -o "${NEARLIB_DIR}/src.ts/protos.d.ts" -
