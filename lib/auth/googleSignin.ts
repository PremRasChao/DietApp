import { GoogleSignin } from "@react-native-google-signin/google-signin";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

// Call once at app startup. Configuring on every button render is wasteful and
// unnecessary — the native SDK holds this config globally.
export function configureGoogleSignin() {
  if (__DEV__ && (!webClientId || !iosClientId)) {
    throw new Error(
      "Missing Google env vars. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and " +
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in .env (see .env.example)."
    );
  }

  GoogleSignin.configure({
    webClientId,
    // Passed explicitly because this project has no GoogleService-Info.plist;
    // without it the library looks for that file and fails on iOS.
    iosClientId,
  });
}
