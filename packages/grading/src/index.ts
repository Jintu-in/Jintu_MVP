export { SQL_MAX_SCORE, gradeSqlSubmission, type RubricCriterion } from "./deterministic/sql";
export { describeDifference, diffResults, type Difference } from "./deterministic/compare";
export {
  hasTableAliases,
  joinsWithoutCondition,
  planHasCrossJoin,
  stripNoise,
  usesSelectStar,
} from "./deterministic/readability";
export type {
  Cell,
  CriterionResult,
  QueryResult,
  QueryRunner,
  Row,
  SqlAssignmentSpec,
  SqlGrade,
} from "./deterministic/types";
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
} from "./rubric-ai";
export {
  CHECKERS,
  CHECKER_NAMES,
  parseCheck,
  runCheck,
  type Checker,
  type CheckerName,
  type CheckResult,
} from "./registry";
