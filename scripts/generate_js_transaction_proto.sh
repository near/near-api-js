#!/usr/bin/env bash
set -ex

NEAR_PROTOS_DIR="${NEAR_PROTOS_DIR:-../nearcore/core/protos/protos}"
NEARLIB_DIR="$(npm prefix)"
PROTOC_GEN_TS_PATH="$(npm bin)/protoc-gen-ts"

protoc \
	--plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
	--js_out="import_style=commonjs,binary:${NEARLIB_DIR}/protos/" \
	--ts_out="${NEARLIB_DIR}/src.ts/protos/" \
	--proto_path=${NEAR_PROTOS_DIR} \
	${NEAR_PROTOS_DIR}/signed_transaction.proto ${NEAR_PROTOS_DIR}/wrappers.proto ${NEAR_PROTOS_DIR}/uint128.proto ${NEAR_PROTOS_DIR}/access_key.proto
