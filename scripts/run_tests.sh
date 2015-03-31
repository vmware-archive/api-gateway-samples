#!/bin/bash
set -x
set -e

function run_test {
	pushd "$1" > /dev/null
	mvn clean test
	if [ $? != 0 ]; then
		exit 1
	fi
	popd > /dev/null
}
export -f run_test

find . -type d -name "sample*" -print0 | xargs -0 -I {} bash -c 'run_test "{}"'

echo "Success"
