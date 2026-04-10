import ConsentName from "../enums/ConsentName";

// source content ids are generated from translations hub
const legallySensitiveContentConstants = {
	[ConsentName.phoneNumberDiscoverabilitySetting]: {
		titleTranslationKey: "Heading.FriendDiscovery",
		titleSourceContentId: "4063304",
		consentTranslationKey: "Description.PhoneNumberDiscoverabilityConsent",
		consentSourceContentId: "4054088",
	},
	[ConsentName.phoneNumberDiscoverabilitySettingParentSide]: {
		titleTranslationKey: "Heading.FriendDiscovery",
		titleSourceContentId: "4063304",
		consentTranslationKey:
			"Description.ParentSide.PhoneNumberDiscoverabilityConsent",
		consentSourceContentId: "4102472",
	},
	[ConsentName.phoneNumberDiscoverabilityUpsell]: {
		titleTranslationKey: "Heading.TurnOnFriendDiscovery",
		titleSourceContentId: "4123720",
		consentTranslationKey:
			"Description.PhoneNumberDiscoverabilityUpsellConsent",
		consentSourceContentId: "4123464",
		actionButtonTextTranslationKey: "Action.FriendDiscovery.TurnOn",
		actionButtonTextSourceContentId: "4123208",
		neutralButtonTextTranslationKey: "Action.FriendDiscovery.NotNow",
		neutralButtonTextSourceContentId: "4122952",
	},
	[ConsentName.phoneNumberDiscoverabilitySettingFriendsRename]: {
		titleTranslationKey: "Heading.FriendDiscovery",
		titleSourceContentId: "4063304",
		consentTranslationKey:
			"Description.PhoneNumberDiscoverabilityConsent.FriendsRename",
		consentSourceContentId: "7216456",
	},
	[ConsentName.phoneNumberDiscoverabilitySettingParentSideFriendsRename]: {
		titleTranslationKey: "Heading.FriendDiscovery",
		titleSourceContentId: "4063304",
		consentTranslationKey:
			"Description.ParentSide.PhoneNumberDiscoverabilityConsent.TFR",
		consentSourceContentId: "7237448",
	},
	[ConsentName.phoneNumberDiscoverabilityUpsellFriendsRename]: {
		titleTranslationKey: "Heading.TurnOnFriendDiscovery",
		titleSourceContentId: "4123720",
		consentTranslationKey:
			"Description.PhoneNumberDiscoverabilityUpsellConsent.FRnm",
		consentSourceContentId: "7235400",
		actionButtonTextTranslationKey: "Action.FriendDiscovery.TurnOn",
		actionButtonTextSourceContentId: "4123208",
		neutralButtonTextTranslationKey: "Action.FriendDiscovery.NotNow",
		neutralButtonTextSourceContentId: "4122952",
	},
	[ConsentName.personalizedAdsSetting]: {
		titleTranslationKey: "Heading.PersonalizeYourAds",
		titleSourceContentId: "4190024",
		consentTranslationKey: "Description.PersonalizeAds",
		consentSourceContentId: "4190536",
		linkStart:
			'<a href="https://en.help.roblox.com/hc/articles/28943243301780" class="text-link">',
		linkEnd: "</a>",
		linkStartParam: "{linkStart}",
		linkEndParam: "{linkEnd}",
	},
	[ConsentName.sellShareDataSetting]: {
		titleTranslationKey: "Heading.DataSellingAndSharing",
		titleSourceContentId: "4190280",
		consentTranslationKey: "Description.DataSellingAndSharing",
		consentSourceContentId: "4190792",
		linkStart:
			'<a href="https://en.help.roblox.com/hc/articles/28943243301780" class="text-link">',
		linkEnd: "</a>",
		linkStartParam: "{linkStart}",
		linkEndParam: "{linkEnd}",
	},
	[ConsentName.allowMarketingEmailCheckboxEmailVerification]: {
		consentTranslationKey: "Description.EmailNotificationsOptIn",
		consentSourceContentId: "4557640",
	},
	[ConsentName.voiceDataConsentSetting]: {
		titleTranslationKey: "Heading.VoiceDataConsent",
		titleSourceContentId: "4565320",
		consentTranslationKey: "Description.VoiceDataConsent",
		consentSourceContentId: "4565576",
		linkStart:
			'<a href="https://en.help.roblox.com/hc/articles/5704050147604" class="text-link">',
		linkEnd: "</a>",
		linkStartParam: "{linkStart}",
		linkEndParam: "{linkEnd}",
	},
	[ConsentName.voiceDataConsentSettingParentSide]: {
		titleTranslationKey: "Heading.VoiceDataConsent",
		titleSourceContentId: "4565320",
		consentTranslationKey: "Description.ParentSide.VoiceDataConsent",
		consentSourceContentId: "4565832",
		linkStart:
			'<a href="https://en.help.roblox.com/hc/articles/5704050147604" class="text-link">',
		linkEnd: "</a>",
		linkStartParam: "{linkStart}",
		linkEndParam: "{linkEnd}",
	},
	[ConsentName.whoCanPartyWithMe]: {
		pageTitleTranslationKey: "Heading.PartyAndPartyChat",
		pageTitleSourceContentId: "7180360",
		pageDescriptionTranslationKey: "Description.PartyAndPartyChat",
		pageDescriptionSourceContentId: "7181640",
		titleTranslationKey: "Label.Party",
		titleSourceContentId: "2137161",
		consentTranslationKey: "Description.PartySettingV3",
		consentSourceContentId: "7181896",
	},
	[ConsentName.whoCanPartyWithMeParentSide]: {
		pageTitleTranslationKey: "Heading.PartyAndPartyChat",
		pageTitleSourceContentId: "7180360",
		pageDescriptionTranslationKey: "Description.PartyAndPartyChatParentSide",
		pageDescriptionSourceContentId: "7261256",
		titleTranslationKey: "Label.Party",
		titleSourceContentId: "2137161",
		consentTranslationKey: "Description.PartySettingConsent",
		consentSourceContentId: "7193928",
	},
	[ConsentName.whoCanUsePartyChatWithMe]: {
		pageTitleTranslationKey: "Heading.PartyAndPartyChat",
		pageTitleSourceContentId: "7180360",
		pageDescriptionTranslationKey: "Description.PartyAndPartyChat",
		pageDescriptionSourceContentId: "7181640",
		titleTranslationKey: "Label.PartyChat",
		titleSourceContentId: "7180616",
		consentTranslationKey: "Description.PartyChat",
		consentSourceContentId: "7182152",
	},
	[ConsentName.whoCanUsePartyChatWithMeParentSide]: {
		pageTitleTranslationKey: "Heading.PartyAndPartyChat",
		pageTitleSourceContentId: "7180360",
		pageDescriptionTranslationKey: "Description.PartyAndPartyChatParentSide",
		pageDescriptionSourceContentId: "7261256",
		titleTranslationKey: "Label.PartyChat",
		titleSourceContentId: "7180616",
		consentTranslationKey: "Description.PartyChatConsent",
		consentSourceContentId: "7194184",
	},
	[ConsentName.whoCanUsePartyVoiceWithMe]: {
		pageTitleTranslationKey: "Heading.PartyAndPartyChat",
		pageTitleSourceContentId: "7180360",
		pageDescriptionTranslationKey: "Description.PartyAndPartyChat",
		pageDescriptionSourceContentId: "7181640",
		titleTranslationKey: "Label.PartyVoiceChat",
		titleSourceContentId: "7181384",
		consentTranslationKey: "Description.PartyVoiceChat",
		consentSourceContentId: "7182408",
	},
	[ConsentName.whoCanUsePartyVoiceWithMeParentSide]: {
		pageTitleTranslationKey: "Heading.PartyAndPartyChat",
		pageTitleSourceContentId: "7180360",
		pageDescriptionTranslationKey: "Description.PartyAndPartyChatParentSide",
		pageDescriptionSourceContentId: "7261256",
		titleTranslationKey: "Label.PartyVoiceChat",
		titleSourceContentId: "7181384",
		consentTranslationKey: "Description.PartyVoiceChatConsent",
		consentSourceContentId: "7194440",
	},
};

export default legallySensitiveContentConstants;
