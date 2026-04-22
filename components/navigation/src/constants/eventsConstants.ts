/**
 * Constants for event stream events in navigation webapp.
 */
const EVENT_CONSTANTS = {
	schematizedEventTypes: {
		authButtonClick: "authButtonClick",
		authClientError: "authClientError",
		authPageLoad: "authPageload",
	},
	context: {
		homepage: "homepage",
		accountSwitcherStatus: "accountSwitcherStatus",
		cachedUserChanged: "cachedUserChanged",
		auth401Modal: "signInRedirect",
		silentPasskeyUpgrade: "handleSilentPasskeyUpgradeWeb",
		silentPasskeyUpgradeWebLoginImmediate:
			"handleSilentPasskeyUpgradeWebLoginImmediate",
		silentPasskeyUpgradeWebLoginDelayed:
			"handleSilentPasskeyUpgradeWebLoginDelayed",
		silentPasskeyUpgradeWebSignupDelayed:
			"handleSilentPasskeyUpgradeWebSignupDelayed",
	},
	btn: {
		logout: "logout",
		switchAccount: "switchAccount",
		signIn: "signIn",
	},
	passkeyUpgradeState: {
		startRegistrationSuccess: "startRegistrationSuccess",
		startRegistrationError: "startRegistrationError",
		createCredentialError: "createCredentialError",
		invalidStateErrorHasExistingPasskey: "invalidStateErrorHasExistingPasskey",
		unknownError: "unknownError",
		finishRegistrationSuccess: "finishRegistrationSuccess",
		finishRegistrationError: "finishRegistrationError",
		httpStatusErrorParsing: "httpStatusErrorParsing",
		consumePasskeySessionFlagError: "consumePasskeySessionFlagError",
	},
} as const;

export default EVENT_CONSTANTS;
