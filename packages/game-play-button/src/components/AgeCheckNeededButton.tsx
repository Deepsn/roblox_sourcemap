import React from "react";
import ActionNeededButton from "./ActionNeededButton";
import playButtonConstants from "../constants/playButtonConstants";
import { PlayabilityStatus } from "../constants/playabilityStatus";
import {
	sendUnlockPlayIntentEvent,
	startAgeCheckAccessManagementUpsellFlow,
} from "../utils/playButtonUtils";
import type { TPlayButtonPageContext } from "../types/playButtonTypes";

const { unlockPlayIntentConstants, playButtonUpsellContexts } =
	playButtonConstants;

type AgeCheckNeededButtonProps = {
	universeId: string;
	buttonClassName?: string;
	playabilityStatus:
		| typeof PlayabilityStatus.ContextualPlayabilityAgeCheckRequired
		| typeof PlayabilityStatus.ContextualPlayabilityUnverifiedSeventeenPlusUser;
	pageContext: TPlayButtonPageContext;
};

export const AgeCheckNeededButton = ({
	universeId,
	buttonClassName,
	playabilityStatus,
	pageContext,
}: AgeCheckNeededButtonProps) => {
	const handlePlayButtonClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			sendUnlockPlayIntentEvent(
				universeId,
				unlockPlayIntentConstants.ageCheckUpsellName,
				playabilityStatus,
				pageContext,
			);

			await startAgeCheckAccessManagementUpsellFlow({
				context: playButtonUpsellContexts.gameJoinAgeCheckRequired,
				pageContext,
			});

			// there is a bug in the wizard that causes it to return false if the user
			// successfully verifies but closes the modal by clicking outside the
			// modal instead of clicking the close button. the workaround here is to
			// reload in all scenarios
			window.location.reload();
		} catch {
			// `startAgeCheckAccessManagementUpsellFlow` emits a metric to track the
			// error being thrown
		}
	};

	return (
		<ActionNeededButton
			// ActionNeededButton doesn't use the result of the call (return is typed
			// as void) so it's safe to disable
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			onButtonClick={handlePlayButtonClick}
			buttonClassName={buttonClassName}
		/>
	);
};
