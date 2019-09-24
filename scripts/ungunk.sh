#!/bin/sh

# Hacky cleanup

INFILE=dist/bundle.js
TARGET=dist/bundle-clean.js
cp $INFILE $TARGET

sed -i 's/^\/\*\*\*.*$//' $TARGET
sed -i 's/^\/\/#.*$//' $TARGET
sed -i 's/^\/\*!.*$//' $TARGET
sed -i 's/^  !\*\*.*$//' $TARGET
sed -i 's/^  \\\*\*.*$//' $TARGET

# Multi-line cleanup

perl -i -pe 'BEGIN{undef $/;} s/^module.exports = {.*?};//smg' $TARGET
perl -i -pe 'BEGIN{undef $/;} s/var _require.*?;//smg' $TARGET

# Remove empty lines

sed -r -i '/^\s*$/d' $TARGET

