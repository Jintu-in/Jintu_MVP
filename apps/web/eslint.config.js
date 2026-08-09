import next from "@jintu/config/eslint/next";

export default [
  ...next,
  {
    ignores: [
      "next-env.d.ts",
      ".next/**",
      // Build output from serwist. It is gitignored, but eslint's flat config
      // does not read .gitignore, so a 50 KB minified bundle would otherwise
      // be linted as if someone had written it.
      "public/sw.js",
      "public/sw.js.map",
      "public/swe-worker-*.js",
    ],
  },
];
