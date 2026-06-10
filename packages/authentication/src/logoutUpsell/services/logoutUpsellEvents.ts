import { eventStreamService } from "core-roblox-utilities";
import AUTH_EVENT_CONSTANTS from "@rbx/authentication-common/constants/eventsConstants";
import {
	LogoutUpsellScreen,
	LogoutUpsellScreenName,
} from "../constants/logoutUpsellScreens";

/**
 * Telemetry for the logout-upsell flow.
 *
 * Events use the shared schematized auth event types (`authModalShown`,
 * `authButtonClick`, `authFormInteraction`, `authClientError`) so they land in
 * the same warehouse tables as the rest of auth (`accountauth_auth_*`). All
 * events share the `logoutUpsell` context; the `field`/`state`/`btn` values
 * below identify the specific screen and action.
 *
 * Keep these string values stable: they show up as enum-like values on
 * dashboards and changing them silently breaks alerting and funnel queries.
 */

const { schematizedEventTypes, aType } = AUTH_EVENT_CONSTANTS;

const LOGOUT_UPSELL_CONTEXT = "logoutUpsell";

/** How the user arrived on the add-email screen. */
export const AddEmailOrigin = {
	/** Tapped "Add email" on the passkey upsell. */
	Passkey: "passkey",
	/** Tapped "Change email" on the verify-email screen. */
	ChangeEmail: "changeEmail",
} as const;

export type AddEmailOriginName =
	(typeof AddEmailOrigin)[keyof typeof AddEmailOrigin];

const Field = {
	email: "email",
} as const;

const Btn = {
	addPasskey: "addPasskey",
	addEmail: "addEmail",
	signOut: "signOut",
	dismiss: "dismiss",
	continue: "continue",
	resend: "resend",
	changeEmail: "changeEmail",
} as const;

const send = (
	eventName: string,
	params: Record<string, string | number | boolean | undefined>,
	context: string = LOGOUT_UPSELL_CONTEXT,
): void => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- untyped legacy module
		eventStreamService.sendEventWithTarget(eventName, context, params);
	} catch {
		// Telemetry is best-effort: never let an event-stream failure break logout.
	}
};

export const LogoutUpsellClientError = {
	/** Caller tried to open the new prompts-service-gated modal entrypoint, but
	 *  the legacy bundle in this page session didn't expose it. Almost always
	 *  a rolling-deploy / cached-bundle skew. */
	LegacyModalEntrypointMissing: "legacyModalEntrypointMissing",
	/** The new entrypoint threw or rejected before dispatching the modal event
	 *  (e.g. `getSettingsUIPolicy()` blew up). We failed open to a direct
	 *  logout, so the user did not get the upsell. */
	LegacyModalOpenFailed: "legacyModalOpenFailed",
} as const;

export type LogoutUpsellClientErrorState =
	(typeof LogoutUpsellClientError)[keyof typeof LogoutUpsellClientError];

export const sendLogoutUpsellClientError = (
	state: LogoutUpsellClientErrorState,
): void => {
	send(schematizedEventTypes.authClientError, { state });
};

// --- Passkey upsell screen ---------------------------------------------------

export const sendPasskeyUpsellShown = (): void => {
	send(schematizedEventTypes.authModalShown, {
		field: LogoutUpsellScreen.PasskeyUpsell,
	});
};

export const sendAddPasskeyClick = (): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.addPasskey,
		state: LogoutUpsellScreen.PasskeyUpsell,
	});
};

export const sendAddEmailClick = (): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.addEmail,
		state: LogoutUpsellScreen.PasskeyUpsell,
	});
};

export const sendSignOutClick = (): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.signOut,
		state: LogoutUpsellScreen.PasskeyUpsell,
	});
};

// --- Add email screen --------------------------------------------------------

export const sendAddEmailShown = (origin: AddEmailOriginName): void => {
	send(schematizedEventTypes.authModalShown, {
		field: LogoutUpsellScreen.AddEmail,
		origin,
	});
};

export const sendEmailFieldInteraction = (origin: AddEmailOriginName): void => {
	send(schematizedEventTypes.authFormInteraction, {
		field: Field.email,
		state: aType.focus,
		origin,
	});
};

export const sendAddEmailContinueClick = (origin: AddEmailOriginName): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.continue,
		state: LogoutUpsellScreen.AddEmail,
		origin,
	});
};

// --- Verify email screen -----------------------------------------------------

export const sendVerifyEmailShown = (): void => {
	send(schematizedEventTypes.authModalShown, {
		field: LogoutUpsellScreen.VerifyEmail,
	});
};

export const sendResendClick = (): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.resend,
		state: LogoutUpsellScreen.VerifyEmail,
	});
};

export const sendContinueToSignOutClick = (): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.signOut,
		state: LogoutUpsellScreen.VerifyEmail,
	});
};

export const sendChangeEmailClick = (): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.changeEmail,
		state: LogoutUpsellScreen.VerifyEmail,
	});
};

// --- Dismiss (X / Escape), shared across screens -----------------------------

export const sendDismissClick = (screen: LogoutUpsellScreenName): void => {
	send(schematizedEventTypes.authButtonClick, {
		btn: Btn.dismiss,
		state: screen,
	});
};
