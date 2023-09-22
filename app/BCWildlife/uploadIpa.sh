# arguments: 1 - path to ipa   2 - apple user   3 - apple app specific password
xcrun altool --upload-app -f $1 -type ios -u $2 -p $3
