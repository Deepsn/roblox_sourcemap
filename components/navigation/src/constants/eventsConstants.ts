/**
 * Constants for event stream events in navigation webapp.
 */
const EVENT_CONSTANTS = {
	schematizedEventTypes: {
		authButtonClick: "authButtonClick",
		authPageLoad: "authPageLoad",
		authClientError: "authClientError",
	},
	context: {
		homepage: "homepage",
		accountSwitcherStatus: "accountSwitcherStatus",
		cachedUserChanged: "cachedUserChanged",
		auth401Modal: "signInRedirect",
		silentPasskeyUpgrade: "handleSilentPasskeyUpgradeWeb",
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
	},
} as const;

export default EVENT_CONSTANTS;
