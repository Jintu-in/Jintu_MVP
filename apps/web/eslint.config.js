import next from "@jintu/config/eslint/next";

export default [
  ...next,
  { ignores: ["next-env.d.ts", ".next/**"] },
];
