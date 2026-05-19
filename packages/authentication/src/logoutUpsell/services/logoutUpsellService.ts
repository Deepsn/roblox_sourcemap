// @ts-expect-error - Legacy Roblox module types
import { EmailVerificationService } from "@rbx/core-scripts/legacy/Roblox";
import ExperimentationService from "@rbx/experimentation";
import {
	getLogoutPrompt,
	LogoutPrompt,
	recordLogoutPromptImpression,
} from "./logoutPromptApi";
import {
	LogoutUpsellClientError,
	sendLogoutUpsellClientError,
} from "./logoutUpsellEvents";

/**
 * Single entry point for the logout upsell flow.
 *
 * Behavior:
 *   1. Read the prompts-service flag from IXP (`Website.LogoutUpsell` /
 *      `IsPromptsServiceEnabled`). If it's disabled in IXP, or IXP errors out
 *      or is unreachable, fall back to the legacy email upsell handler — it
 *      runs the legacy `IsEmailUpsellAtLogoutEnabled` + email-status checks
 *      and that preserves today's logout behavior.
 *   2. When prompts service is enabled, ask the modals service for an eligible
 *      logout prompt and dispatch on `promptType`:
 *        - `LogoutEmailUpsellV1` → record an impression and open the legacy
 *          email upsell modal directly via `openLogoutEmailUpsellModal`. The
 *          prompts service has already decided this user should see the
 *          modal, so we skip the legacy eligibility checks (metadata flag +
 *          email-status GET) and just render.
 *        - Anything else (including no prompt) → log out directly. Renderers
 *          for new prompt types land in follow-up PRs that add branches to
 *          `dispatchPrompt`.
 *        TODO: adjust the above comment when adding passkey upsell handling
 */

const LOGOUT_UPSELL_LAYER = "Website.LogoutUpsell";

// From modals-eligibility-service config
const PROMPT_TYPE_LOGOUT_EMAIL_UPSELL_V1 = "LogoutEmailUpsellV1";

export type HandleLogoutUpsellOptions = {
	/** Called when the upsell flow is finished and the page should log out. */
	onLogout: () => void;
};

const isPromptsServiceEnabled = async (): Promise<boolean> => {
	try {
		const ixp =
			await ExperimentationService.getAllValuesForLayer(LOGOUT_UPSELL_LAYER);
		return ixp?.IsPromptsServiceEnabled === true;
	} catch {
		return false;
	}
};

// This includes the legacy email service & authAPI checks that get skipped if
// prompts service is enabled
const runLegacyEmailUpsell = (onLogout: () => void): void => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises -- untyped legacy module
	EmailVerificationService?.handleUserEmailUpsellAtLogout(onLogout).then(
		(data: { emailAddress?: string } | null | undefined) => {
			if (!data || data.emailAddress) {
				onLogout();
			}
		},
	);
};

// Skips email service & authAPI checks (done by prompts service)
const openLegacyEmailUpsellModal = (onLogout: () => void): void => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- untyped legacy module
	const openModal = EmailVerificationService?.openLogoutEmailUpsellModal as
		| ((skipCallback: () => void) => Promise<void> | void)
		| undefined;
	if (typeof openModal !== "function") {
		// if new method is missing due to cached bundle, fall back to legacy path
		sendLogoutUpsellClientError(
			LogoutUpsellClientError.LegacyModalEntrypointMissing,
		);
		runLegacyEmailUpsell(onLogout);
		return;
	}
	const failOpen = () => {
		sendLogoutUpsellClientError(LogoutUpsellClientError.LegacyModalOpenFailed);
		onLogout();
	};
	try {
		Promise.resolve(openModal(onLogout)).catch(failOpen);
	} catch {
		failOpen();
	}
};

const dispatchPrompt = (prompt: LogoutPrompt, onLogout: () => void): void => {
	switch (prompt.promptType) {
		case PROMPT_TYPE_LOGOUT_EMAIL_UPSELL_V1:
			recordLogoutPromptImpression(prompt.promptType);
			openLegacyEmailUpsellModal(onLogout);
			return;
		// TODO: Handle passkey upsell response (with & without email) from PS
		default:
			onLogout();
	}
};

export const handleLogoutUpsell = async ({
	onLogout,
}: HandleLogoutUpsellOptions): Promise<void> => {
	const enabled = await isPromptsServiceEnabled();
	if (!enabled) {
		runLegacyEmailUpsell(onLogout);
		return;
	}

	const prompt = await getLogoutPrompt();
	if (!prompt) {
		onLogout();
		return;
	}

	dispatchPrompt(prompt, onLogout);
};
