import { GoogleSignin } from "@react-native-google-signin/google-signin";

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export function configureGoogleSignin() {
  if (__DEV__ && (!webClientId || !iosClientId)) {
    console.warn(
      "[Auth] Missing Google env vars. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and " +
        "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID to .env (see .env.example)."
    );
  }
  GoogleSignin.configure({ webClientId, iosClientId });
}
