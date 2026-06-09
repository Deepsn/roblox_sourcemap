/**
 * Fixed `reason` strings emitted on biometric event-stream and metrics events
 * across the persona liveness flows. Always pick a value from this map — never
 * pass a dynamic string — so analytics dashboards can rely on a closed set.
 *
 * The first segment encodes the UI variant:
 *   - `persona*`  → V1 embedded Persona SDK (line `personaLivenessV1.tsx`)
 *   - `hosted*`   → V1 hosted-modal handoff (`personaLivenessHostedModal.tsx`)
 */
export const TELEMETRY_REASONS = {
	// `challengeDisplayed`: which UI variant became visible.
	PERSONA_DISPLAYED: "PersonaDisplayed",
	HOSTED_DISPLAYED: "HostedDisplayed",

	// `challengeInvalidated`: cause of an unrecoverable failure.
	START_LIVENESS_FAILED: "StartLivenessFailed",
	PERSONA_POLLING_TIMEOUT: "PersonaPollingTimeout",
	HOSTED_POLLING_TIMEOUT: "HostedPollingTimeout",

	// `challengeAbandoned`: who/what triggered the abandon.
	PERSONA_USER_ABANDON: "PersonaUserAbandon",
	HOSTED_USER_ABANDON: "HostedUserAbandon",
} as const;

export type TelemetryReason =
	(typeof TELEMETRY_REASONS)[keyof typeof TELEMETRY_REASONS];
