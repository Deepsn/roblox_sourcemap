import React, { useCallback } from "react";
import { sendUnlockPlayIntentEvent } from "../utils/playButtonUtils";
import ActionNeededButton from "./ActionNeededButton";
import playButtonConstants from "../constants/playButtonConstants";
import { PlayabilityStatus } from "../constants/playabilityStatus";

const { counterEvents, unlockPlayIntentConstants } = playButtonConstants;

type TExperienceApprovalActionNeededButtonProps = {
	universeId: string;
	buttonClassName?: string;
};

const ExperienceApprovalActionNeededButton = ({
	universeId,
	buttonClassName,
}: TExperienceApprovalActionNeededButtonProps): React.JSX.Element => {
	const onButtonClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const { fireEvent } = window.EventTracker ?? {};
			fireEvent?.(counterEvents.PlayButtonUpsellExperienceApprovalTriggered);

			sendUnlockPlayIntentEvent(
				universeId,
				unlockPlayIntentConstants.experienceApprovalUpsellName,
				PlayabilityStatus.ContextualPlayabilityRequireParentApproval,
			);

			if (!window.Roblox.AccessManagementUpsellV2Service) {
				fireEvent?.(counterEvents.PlayButtonUpsellExperienceApprovalError);
				return;
			}

			window.Roblox.AccessManagementUpsellV2Service.startAccessManagementUpsell(
				{
					featureName: "CanApproveExperience",
					isAsyncCall: false,
					usePrologue: true,
					ampRecourseData: {
						universeId,
						experienceManagementAction: "Approve",
					},
				},
			).catch(() => {
				fireEvent?.(counterEvents.PlayButtonUpsellExperienceApprovalError);
			});
		},
		[universeId],
	);

	return (
		<ActionNeededButton
			onButtonClick={onButtonClick}
			buttonClassName={buttonClassName}
		/>
	);
};

ExperienceApprovalActionNeededButton.defaultProps = {
	buttonClassName: undefined,
};

export default ExperienceApprovalActionNeededButton;
