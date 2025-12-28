import React, { forwardRef } from "react";
import { TGetFriendsResponse } from "../types/bedev1Types";
import { FeaturedGridTile } from "./FeaturedGameTile";
import { TSharedGameTileProps } from "./GameTileUtils";
import {
	TComponentType,
	TPlayButtonStyle,
	TPlayerCountStyle,
	THoverStyle,
} from "../types/bedev2Types";
import GameTileTypeMap from "./GameTileTypeMap";
import { PageContext } from "../types/pageContext";

type TGameGridTileProps = TSharedGameTileProps & {
	emphasis: boolean;
	friendData?: TGetFriendsResponse[];
	componentType?: TComponentType;
	playerCountStyle?: TPlayerCountStyle;
	playButtonStyle?: TPlayButtonStyle;
	isSponsoredFooterAllowed?: boolean;
	hideTileMetadata?: boolean;
	hoverStyle?: THoverStyle;
	isInterestedUniverse?: boolean;
	enableExplicitFeedback?: boolean;
	isHidden?: boolean;
	setIsHidden?: (isHidden: boolean) => void;
	toggleIsHidden?: () => void;
	toggleInterest?: () => void;
	page?: PageContext;
};

export const GameGridTile = forwardRef<HTMLDivElement, TGameGridTileProps>(
	(
		{
			emphasis,
			friendData,
			componentType,
			playerCountStyle,
			playButtonStyle,
			isSponsoredFooterAllowed,
			hideTileMetadata,
			hoverStyle,
			topicId,
			isInterestedUniverse,
			enableExplicitFeedback,
			isHidden,
			setIsHidden,
			toggleIsHidden,
			toggleInterest,
			page,
			...props
		}: TGameGridTileProps,
		ref,
	) => {
		if (emphasis) {
			return <FeaturedGridTile ref={ref} {...props} />;
		}

		return (
			<GameTileTypeMap
				ref={ref}
				friendData={friendData}
				componentType={componentType}
				playerCountStyle={playerCountStyle}
				playButtonStyle={playButtonStyle}
				isSponsoredFooterAllowed={isSponsoredFooterAllowed}
				hideTileMetadata={hideTileMetadata}
				hoverStyle={hoverStyle}
				topicId={topicId}
				isInterestedUniverse={isInterestedUniverse}
				enableExplicitFeedback={enableExplicitFeedback}
				isHidden={isHidden}
				setIsHidden={setIsHidden}
				toggleIsHidden={toggleIsHidden}
				toggleInterest={toggleInterest}
				page={page}
				{...props}
			/>
		);
	},
);

GameGridTile.displayName = "GameGridTile";
GameGridTile.defaultProps = {
	friendData: [],
	componentType: undefined,
	playerCountStyle: undefined,
	playButtonStyle: undefined,
	isSponsoredFooterAllowed: undefined,
	hideTileMetadata: undefined,
	hoverStyle: undefined,
	isInterestedUniverse: undefined,
	toggleInterest: undefined,
};

export default GameGridTile;
