const UNKNOWN_ERROR = "Es ist ein unbekannter Fehler aufgetreten";
const INVALID_LOGIN_ERROR = "invalid-login";
const DATABASE_CONNECTION_ERROR =
  "Es ist ein Fehler mit der Verbindung zur Datenbank aufgetreten";
const DATABASE_ERROR = "Es ist ein Fehler mit der Datenbank aufgetreten";
const DATABASE_USER_UNAUTHORIZED =
  "Der Nutzer ist nicht berechtigt, auf die Datenbank zuzugreifen";
const DATABASE_INVALID_REQUEST = "Die Anfrage an die Datenbank ist ungültig";
const VALUE_TOO_LONG = "Der Wert ist zu lang";
const NOT_FOUND = "Nicht gefunden";
const TIMEOUT_ERROR = "Zeitüberschreitung bei der Anfrage";
const UNIQUE_CONSTRAINT_VIOLATION = "Einzigartigkeitsbedingung verletzt";
const FOREIGN_KEY_CONSTRAINT_FAILED = "Fremdschlüsselbedingung verletzt";
const NULL_CONSTRAINT_VIOLATION = "NULL-Bedingung verletzt";
const PERMISSION_DENIED = "Zugriff verweigert";
const INVALID_VALUE = "Ungültiger Wert";
const DATA_VALIDATION_ERROR = "Datenvalidierungsfehler";
const TRANSACTION_ERROR = "Transaktionsfehler";
const MIGRATION_ERROR = "Migrationsfehler";
const DATABASE_ALREADY_EXISTS = "Die Datenbank existiert bereits";
const SCHEMA_INCONSISTENT = "Inkonsistente Schema-Datenbank";
const CONNECTION_LIMIT_EXCEEDED = "Datenbankverbindungsgrenze überschritten";
const REPLICA_SET_REQUIRED = "MongoDB-Replikatsatz erforderlich";
const PARAMETER_LIMIT_EXCEEDED = "Abfrageparametergrenze überschritten";
const PLAN_LIMIT_REACHED = "Plan-Limit erreicht";
const VERSION_NOT_SUPPORTED = "Die Prisma-Version wird nicht unterstützt";
const TOO_MANY_REQUESTS = "Zu viele Anfragen";
const PROJECT_DISABLED = "Das Projekt ist deaktiviert";
const SERVER_ERROR = "Serverfehler aufgetreten";

export const ERRORS = {
  UNKNOWN_ERROR,
  DATABASE_CONNECTION_ERROR,
  DATABASE_ERROR,
  DATABASE_USER_UNAUTHORIZED,
  DATABASE_INVALID_REQUEST,
  VALUE_TOO_LONG,
  NOT_FOUND,
  TIMEOUT_ERROR,
  UNIQUE_CONSTRAINT_VIOLATION,
  FOREIGN_KEY_CONSTRAINT_FAILED,
  NULL_CONSTRAINT_VIOLATION,
  PERMISSION_DENIED,
  INVALID_VALUE,
  DATA_VALIDATION_ERROR,
  TRANSACTION_ERROR,
  MIGRATION_ERROR,
  DATABASE_ALREADY_EXISTS,
  SCHEMA_INCONSISTENT,
  CONNECTION_LIMIT_EXCEEDED,
  REPLICA_SET_REQUIRED,
  PARAMETER_LIMIT_EXCEEDED,
  PLAN_LIMIT_REACHED,
  VERSION_NOT_SUPPORTED,
  TOO_MANY_REQUESTS,
  PROJECT_DISABLED,
  SERVER_ERROR,
  INVALID_LOGIN_ERROR,
};
