import React, { useMemo, useEffect, useRef } from "react";
import { TranslateFunction } from "react-utilities";
import { fireEvent } from "roblox-event-tracker";
import {
	Icon,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Menu,
	MenuSection,
	MenuItem,
} from "@rbx/foundation-ui";
import {
	FeatureGameDetails,
	FeaturePlacesList,
} from "../constants/translationConstants";
import { userSignal, gameTile } from "../constants/configConstants";
import { GameTileOverflowMenuActionType } from "../constants/eventStreamConstants";
import { PageContext } from "../types/pageContext";
import useSendNotInterestedUserSignalCallback from "./useSendNotInterestedUserSignalCallback";
import { GameTileOverflowMenuItems } from "../types/gameTileOverflowMenuItems";

type TGameTileOverflowMenuItem = {
	iconName?: React.ComponentProps<typeof Icon>["name"];
	value: GameTileOverflowMenuItems;
	title: string;
	onSelect: () => void;
};

type TGameTileOverflowMenuProps = {
	open: boolean;
	closeMenu: (
		availableMenuItems: GameTileOverflowMenuItems[],
		menuItem?: GameTileOverflowMenuItems,
	) => void;
	toggleMenu: (
		availableMenuItems: GameTileOverflowMenuItems[],
		menuItem?: GameTileOverflowMenuItems,
	) => void;
	sendActionEvent: (
		actionType: GameTileOverflowMenuActionType,
		availableMenuItems: GameTileOverflowMenuItems[],
		menuItem?: GameTileOverflowMenuItems,
	) => void;
	universeId: number;
	topicId?: string;
	page?: PageContext;
	enableExplicitFeedback?: boolean;
	setIsHidden?: (isHidden: boolean) => void;
	toggleIsHidden?: () => void;
	translate: TranslateFunction;
};

const GameTileOverflowMenu = ({
	open,
	closeMenu,
	toggleMenu,
	sendActionEvent,
	universeId,
	topicId,
	page,
	enableExplicitFeedback,
	setIsHidden,
	toggleIsHidden,
	translate,
}: TGameTileOverflowMenuProps): JSX.Element | null => {
	const hasFiredErrorCounter = useRef(false);
	useEffect(() => {
		if (
			!hasFiredErrorCounter.current &&
			enableExplicitFeedback &&
			!setIsHidden
		) {
			fireEvent(userSignal.ExplicitFeedbackDisabledDueToMissingSetter);
			hasFiredErrorCounter.current = true;
		}
	}, [enableExplicitFeedback, setIsHidden]);

	const sendNotInterestedUserSignal = useSendNotInterestedUserSignalCallback(
		universeId,
		translate,
		page,
		topicId,
		toggleIsHidden,
	);

	const menuItemsToShow = useMemo(() => {
		const items: GameTileOverflowMenuItems[] = [];
		if (enableExplicitFeedback && setIsHidden) {
			items.push(GameTileOverflowMenuItems.NotInterested);
		}
		return items;
	}, [enableExplicitFeedback, setIsHidden]);

	const menuItems = useMemo(() => {
		const items: TGameTileOverflowMenuItem[] = [];
		menuItemsToShow.forEach((itemToShow) => {
			switch (itemToShow) {
				case GameTileOverflowMenuItems.NotInterested:
					items.push({
						iconName: "icon-filled-circle-slash",
						value: GameTileOverflowMenuItems.NotInterested,
						title: translate(FeatureGameDetails.ActionNotInterested),
						onSelect: () => {
							setIsHidden?.(true);
							sendNotInterestedUserSignal(true);
							sendActionEvent(
								GameTileOverflowMenuActionType.GameTileOverflowMenuItemActivated,
								menuItemsToShow,
								GameTileOverflowMenuItems.NotInterested,
							);
							closeMenu(menuItemsToShow);
						},
					});
					break;
				default:
					fireEvent(gameTile.UnsupportedMenuItemCounterEvent);
					break;
			}
		});
		return items;
	}, [
		sendActionEvent,
		menuItemsToShow,
		setIsHidden,
		sendNotInterestedUserSignal,
		closeMenu,
		translate,
	]);

	if (menuItems.length === 0) {
		return null;
	}

	return (
		<div
			data-testid="game-tile-overflow-button"
			className="game-tile-overflow-button"
		>
			<Popover open={open} onOpenChange={() => toggleMenu(menuItemsToShow)}>
				<PopoverTrigger asChild>
					<IconButton
						icon="icon-filled-three-dots-horizontal"
						ariaLabel={translate(FeaturePlacesList.ActionOpenTileMenu)}
						size="Small"
						variant="OverMedia"
						isCircular
						onClick={(e: React.MouseEvent<Element>) => {
							// need to prevent default because when the overflow menu is on a tile, clicking it will activate the link and navigate to the game page
							// preventing default also prevents the icon button from triggering the menu as normal so we need to control open state ourselves
							e.preventDefault();
							toggleMenu(menuItemsToShow);
						}}
					/>
				</PopoverTrigger>
				<PopoverContent
					side="bottom"
					align="end"
					ariaLabel={translate(FeaturePlacesList.LabelTileMenu)}
				>
					<Menu
						size="Medium"
						// limiting the width of the menu to the available space on the screen to prevent it from overflowing
						className="max-width-[calc(var(--radix-popover-content-available-width)-2rem)]"
					>
						<MenuSection>
							{menuItems.map((menuItemData) => (
								<MenuItem
									leading={
										menuItemData.iconName ? (
											<Icon name={menuItemData.iconName} />
										) : undefined
									}
									key={menuItemData.value}
									value={menuItemData.value}
									title={menuItemData.title}
									onSelect={menuItemData.onSelect}
								/>
							))}
						</MenuSection>
					</Menu>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default GameTileOverflowMenu;
