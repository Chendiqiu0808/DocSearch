# DocSearch 应用构建APK指南

## 概述

本文档提供了将DocSearch应用构建为Android APK的详细步骤。由于Windows环境下直接构建APK有限制，我们提供了几种可行的方法。

## 方法一：使用EAS Build（推荐）

[EAS Build](https://docs.expo.dev/build/introduction/)是Expo官方提供的云构建服务，可以在云端为您构建APK文件，无需本地Android开发环境。

### 步骤：

1. **安装EAS CLI**
   ```
   npm install -g eas-cli
   ```

2. **登录Expo账号**
   ```
   eas login
   ```
   如果没有账号，请先在[Expo官网](https://expo.dev/)注册。

3. **配置构建设置**
   项目中已经创建了`eas.json`文件，并配置了APK构建配置：
   ```json
   {
     "cli": {
       "version": ">= 16.3.2",
       "appVersionSource": "remote"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {
         "autoIncrement": true
       },
       "apk": {
         "android": {
           "buildType": "apk"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

4. **启动构建**
   ```
   eas build -p android --profile apk
   ```

5. **下载APK**
   构建完成后，您可以从Expo网站下载APK文件，或者通过命令行提供的链接下载。

## 方法二：使用Android Studio

如果您希望在本地构建APK，可以使用Android Studio。

### 步骤：

1. **安装Android Studio**
   从[官方网站](https://developer.android.com/studio)下载并安装Android Studio。

2. **准备React Native项目**
   ```
   npx expo prebuild -p android
   ```
   这将生成Android原生项目文件。

3. **使用Android Studio打开项目**
   打开Android Studio，选择「Open an existing project」，然后导航到项目的`android`文件夹。

4. **构建APK**
   在Android Studio中，选择「Build」>「Build Bundle(s) / APK(s)」>「Build APK(s)」。

5. **找到APK文件**
   构建完成后，APK文件通常位于`android/app/build/outputs/apk/debug/`或`android/app/build/outputs/apk/release/`目录下。

## 方法三：使用Expo Snack或Expo Go

如果您只是想在手机上测试应用，可以考虑使用Expo Go应用。

1. **安装Expo Go**
   在手机上从应用商店安装[Expo Go](https://expo.dev/client)应用。

2. **启动开发服务器**
   ```
   npx expo start
   ```

3. **使用Expo Go扫描QR码**
   使用Expo Go应用扫描终端中显示的QR码，即可在手机上运行应用。

## 注意事项

- 构建APK需要配置应用签名密钥，EAS Build会自动为您处理这一步骤。
- 如果您计划发布到Google Play商店，建议使用AAB（Android App Bundle）格式而非APK。
- 确保在`app.json`中配置了正确的应用信息，如应用名称、版本号等。

## 故障排除

- 如果构建失败，请检查Expo和React Native的版本兼容性。
- 确保您的`package.json`中包含所有必要的依赖。
- 对于Windows用户，使用EAS Build云服务是最简单的方法，因为它避免了本地环境配置的复杂性。

## 参考资源

- [Expo文档 - EAS Build](https://docs.expo.dev/build/setup/)
- [React Native文档 - 生成签名APK](https://reactnative.dev/docs/signed-apk-android)
- [Expo应用构建指南](https://docs.expo.dev/build-reference/apk/)