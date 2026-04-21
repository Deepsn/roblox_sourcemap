import React from "react";
import { TranslateFunction } from "react-utilities";
import { Icon } from "@rbx/foundation-ui";

type BlackbirdHeadingProps = {
	translate: TranslateFunction;
	size?: "large" | "small";
};

const BlackbirdHeading: React.FC<BlackbirdHeadingProps> = ({
	translate,
	size = "large",
}) => (
	<div className="gap-x-small flex items-center">
		<Icon className="!size-1000" name="icon-regular-roblox-plus" />
		{size === "large" ? (
			<div className="font-builder-extended text-display-small text-no-wrap">
				{translate("Label.Blackbird")}
			</div>
		) : (
			<div className="text-heading-large">{translate("Label.Blackbird")}</div>
		)}
	</div>
);

export default BlackbirdHeading;
