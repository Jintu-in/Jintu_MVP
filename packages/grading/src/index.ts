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
