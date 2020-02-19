license-checker --production --excludePackages datanator_frontend@0.1.0 --out LICENSE-THIRD-PARTY

# Remove local paths
cwd=`pwd`
sed -i "s|$cwd/node_modules/||g" LICENSE-THIRD-PARTY

# Remove paths to packages
sed -i -E 's/[│ ]  [├└]─ path: .*$//g' LICENSE-THIRD-PARTY
sed -i '/^$/d' LICENSE-THIRD-PARTY

# Clean up directory tree
sed -i ':a;N;$!ba;s/\n/\x00/g' LICENSE-THIRD-PARTY
sed -i 's/[│ ]  ├─ \([^\x00]*\)\x00├─/│  └─ \1\x00├─/g' LICENSE-THIRD-PARTY
sed -i 's/\x00/\
/g' LICENSE-THIRD-PARTY

# Add header to top of file
header="The following is a list of the licenses of the third party dependencies of Datanator, including the location of each license file where available. This list was generated using license-checker (https://github.com/davglass/license-checker)."
echo "${header}\n\n$(cat LICENSE-THIRD-PARTY)" > LICENSE-THIRD-PARTY
