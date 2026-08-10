export {
  NOTICE_VERSION,
  waitlistInput,
  type WaitlistInput,
  normaliseIndianMobile,
  // Extensionless: moduleResolution is "bundler", and this package ships TS
  // source that Next transpiles. A ".js" specifier type-checks but Turbopack
  // will not map it back to the .ts file.
} from "./waitlist";

export {
  OPTIONAL_PURPOSES,
  consentToggleInput,
  onboardingInput,
  otpRequestInput,
  otpVerifyInput,
  type OnboardingInput,
  type OptionalPurpose,
  safeNextPath,
} from "./auth";

export {
  peerReviewInput,
  queryResult,
  sqlAnswerKey,
  type PeerReviewInput,
  type SqlAnswerKey,
} from "./grading";

export {
  URL_REJECTION_MESSAGE,
  artifactSubmissionInput,
  checkArtifactUrl,
  sqlSubmissionInput,
  submissionInput,
  type SubmissionInput,
  type UrlRejection,
} from "./submission";

export { profileUpdateInput, type ProfileUpdateInput } from "./profile";
export { courseVoteInput, type CourseVoteInput } from "./proposals";
