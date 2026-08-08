export {
  NOTICE_VERSION,
  waitlistInput,
  type WaitlistInput,
  normaliseIndianMobile,
  // Extensionless: moduleResolution is "bundler", and this package ships TS
  // source that Next transpiles. A ".js" specifier type-checks but Turbopack
  // will not map it back to the .ts file.
} from "./waitlist";
