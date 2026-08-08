import { TranslateFunction } from "@rbx/core-scripts/react";
import { Link } from "@rbx/core-ui";
import { buildReportAbuseRevampUrl } from "../../common/utils/browserUtils";
import { FeatureGameDetails } from "../../common/constants/translationConstants";

type TGameDescriptionFooterProps = {
	placeId: string;
	universeId: string;
	copyingAllowed: boolean;
	translate: TranslateFunction;
};

const GameDescriptionFooter = ({
	placeId,
	universeId,
	copyingAllowed,
	translate,
}: TGameDescriptionFooterProps): JSX.Element => {
	const abuseReportUrl = buildReportAbuseRevampUrl({ placeId, universeId });

	return (
		<div className="game-description-footer">
			{copyingAllowed && (
				<p className="text-pastname">
					{translate(FeatureGameDetails.LabelPlaceCopyingAllowed)}
				</p>
			)}
			<Link className="text-report" url={abuseReportUrl}>
				{translate(FeatureGameDetails.LabelReportAbuse)}
			</Link>
		</div>
	);
};

export default GameDescriptionFooter;
