react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/
cd android/
rm -rf app/src/main/res/drawable-*
rm -rf app/src/main/res/raw
./gradlew assembleRelease
