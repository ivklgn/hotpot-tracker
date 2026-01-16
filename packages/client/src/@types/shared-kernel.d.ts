/**
 * Branded type for JSON-serialized strings
 * Use this to distinguish JSON strings from regular strings at the type level
 */
type JSONString = string;

/**
 * Type for task content (TipTap editor JSON)
 */
type TaskContentJSON = JSONString;

/**
 * Type for event payload (any valid JSON object)
 */
type EventPayloadJSON = JSONString;
