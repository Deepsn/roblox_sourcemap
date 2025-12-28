var Roblox = Roblox || {};
Roblox.LangDynamic = Roblox.LangDynamic || {};
Roblox.LangDynamic["Feature.Denied"] = {
	"Denied.Header": "Action Restricted",
	"Denied.Body":
		"For your account security, we're unable to complete your request at this time. Please try again on a previously used device or contact support for assistance.",
	"Denied.Action": "OK",
	"Denied.AutomatedTampering.Body":
		"We detected suspicious automated activity on your account and can’t complete your request right now. Please disable all web extensions and wait at least a few minutes before trying again. For instructions, see the “Disable Your Web Browser’s Add-Ons” section in the {linkStart}Help Article{linkEnd}.",
	"Denied.DeviceBlock.Body":
		"This device has been banned due to severe violations of our {communityStandardsLinkStart}Community Standards{communityStandardsLinkEnd}. To {appealLinkStart}appeal{appealLinkEnd} or check your appeal status, log in to the account associated with this violation.",
	"Denied.DeviceBlock.Header": "Device Banned",
	"Denied.DeviceBlockCredentialVariant.Body":
		"This device has been banned due to severe violations of our {communityStandardsLinkStart}Community Standards{communityStandardsLinkEnd}. To {appealLinkStart}appeal{appealLinkEnd} or check your appeal status, log in to the account associated with this violation using your username or passkey.",
	"Denied.EppUnenroll.Body":
		"This setting is required for the Enhanced Protection Program. Unenroll from the program to remove this setting.",
};
window.Roblox &&
	window.Roblox.BundleDetector &&
	window.Roblox.BundleDetector.bundleDetected(
		"DynamicLocalizationResourceScript_Feature.Denied",
	);
