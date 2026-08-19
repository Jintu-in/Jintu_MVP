export {
  RESERVED_HANDLES,
  deleteAccountInput,
  displayNameInput,
  handleSchema,
  publicProfileInput,
  reminderPrefsInput,
  timezoneSchema,
  timezoneUpdateInput,
  type PublicProfileInput,
  type ReminderPrefsInput,
} from "./account";
export {
  NOTICE_VERSION,
  OPTIONAL_PURPOSES,
  consentToggleInput,
  normaliseIndianMobile,
  onboardingInput,
  otpRequestInput,
  otpVerifyInput,
  type OnboardingInput,
  type OptionalPurpose,
  passwordSignInInput,
  setPasswordInput,
  safeNextPath,
  type PasswordSignInInput,
  type SetPasswordInput,
  // Extensionless: moduleResolution is "bundler", and this package ships TS
  // source that Next transpiles. A ".js" specifier type-checks but Turbopack
  // will not map it back to the .ts file.
} from "./auth";

export { profileUpdateInput, type ProfileUpdateInput } from "./profile";
