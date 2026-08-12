// GENERATED from packages/grading/src by scripts/build-deno-grading.mjs.
// Do not edit: edit the package source and re-run the build. CI fails on drift.
export {
  DB_ARCHETYPES,
  toDbArchetype,
  toEngineCheck,
  type DbArchetype,
  type EngineArchetype,
} from "./archetypes.ts";
export { SQL_MAX_SCORE, gradeSqlSubmission, type RubricCriterion } from "./deterministic/sql.ts";
export { describeDifference, diffResults, type Difference } from "./deterministic/compare.ts";
export {
  hasTableAliases,
  joinsWithoutCondition,
  planHasCrossJoin,
  stripNoise,
  usesSelectStar,
} from "./deterministic/readability.ts";
export type {
  Cell,
  CriterionResult,
  QueryResult,
  QueryRunner,
  Row,
  SqlAssignmentSpec,
  SqlGrade,
} from "./deterministic/types.ts";
export {
  RUBRIC_AI_MAX_OUTPUT_TOKENS,
  RUBRIC_AI_MODEL,
  actualCostPaise,
  aiCriteria,
  buildRubricPrompt,
  estimateCostPaise,
  parseRubricVerdict,
  type AiCriterion,
  type RubricAiVerdict,
} from "./rubric-ai.ts";
export {
  canPublishAsVerified,
  grade,
  type CriterionResult as EngineCriterionResult,
  type EngineCriterion,
  type EngineRubric,
  type EngineSubmission,
  type GradeCtx,
  type GradeReport,
  type PublishVerdict,
} from "./engine.ts";
export {
  CHECKERS,
  CHECKER_NAMES,
  parseCheck,
  runCheck,
  type Checker,
  type CheckerName,
  type CheckResult,
} from "./registry.ts";
