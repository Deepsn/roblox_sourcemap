import { authenticatedUser } from "@rbx/core-scripts/legacy/header-scripts";
import {
	authenticatedUser as authenticatedUserMeta,
	isBlackbirdUser,
} from "@rbx/core-scripts/meta/user";
import { TranslationProvider, useTranslation } from "@rbx/core-scripts/react";
import { Link } from "@rbx/core-ui/legacy/react-style-guide";
import { Thumbnail2d, ThumbnailTypes } from "@rbx/thumbnails";
import {
	BadgeSizes,
	VerifiedBadgeIconContainer,
	currentUserHasVerifiedBadge,
} from "@rbx/roblox-badges";
import {
	DisplayNameBadges,
	useIsPlusBadgeEnabled,
	PLUS_BADGE_ARIA_LABEL,
	PLUS_BADGE_ARIA_LABEL_KEY,
} from "@rbx/identity-badges";
import links from "../constants/linkConstants";
import useLiveUserNameForDisplay from "../hooks/useLiveUserNameForDisplay";
import { translations } from "../../component.json";

function AgeBracketDisplayContent() {
	const { translate } = useTranslation();
	const metaUser = authenticatedUserMeta();
	const nameForDisplay = useLiveUserNameForDisplay(metaUser);

	const badgeToRender = currentUserHasVerifiedBadge() ? (
		<section>
			<VerifiedBadgeIconContainer
				overrideImgClass="verified-badge-icon-header"
				size={BadgeSizes.CAPTIONHEADER}
			/>
		</section>
	) : null;

	const showPlusBadge = useIsPlusBadgeEnabled() && isBlackbirdUser();

	return (
		<div className="age-bracket-label text-header">
			<Link
				className="text-link dynamic-overflow-container"
				url={links.scrollListItems.profile.url}
			>
				<span className="avatar avatar-headshot-xs">
					<Thumbnail2d
						containerClass="avatar-card-image"
						targetId={authenticatedUser.id ?? 0}
						type={ThumbnailTypes.avatarHeadshot}
						altName={authenticatedUser.name ?? undefined}
					/>
				</span>
				<span className="text-overflow age-bracket-label-username font-caption-header">
					{nameForDisplay}
				</span>
				{badgeToRender}
				{showPlusBadge ? (
					<section className="age-bracket-label-plus-badge">
						<DisplayNameBadges
							isRobloxPlus
							size="Small"
							plusBadgeAriaLabel={translate(
								PLUS_BADGE_ARIA_LABEL_KEY,
								undefined,
								PLUS_BADGE_ARIA_LABEL,
							)}
						/>
					</section>
				) : null}
			</Link>
		</div>
	);
}

// `useTranslation` needs a `TranslationProvider` ancestor; this component is
// mounted standalone, so wrap it the same way navigation's leftNav does.
function AgeBracketDisplay() {
	return (
		<TranslationProvider config={translations}>
			<AgeBracketDisplayContent />
		</TranslationProvider>
	);
}

export default AgeBracketDisplay;
