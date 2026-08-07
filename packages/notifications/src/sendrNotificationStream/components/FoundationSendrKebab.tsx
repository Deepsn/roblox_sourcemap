import React, { useState } from "react";
import {
	Icon,
	IconButton,
	Menu,
	MenuItem,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@rbx/foundation-ui";
import { VisualItemMetaAction } from "../types/NotificationTemplateTypes";

const metaActionIconMap = {
	report: "icon-regular-triangle-exclamation",
	turnOnNotifications: "icon-regular-bell",
	turnOffNotifications: "icon-regular-bell-slash",
} as const;

type MetaActionIcon = keyof typeof metaActionIconMap;

const isMetaActionIcon = (icon: string | undefined): icon is MetaActionIcon =>
	icon !== undefined && icon in metaActionIconMap;

export type FoundationSendrKebabProps = {
	actions: Array<VisualItemMetaAction>;
	onSelect: (action: VisualItemMetaAction) => void;
	ariaLabel: string;
};

export const FoundationSendrKebab = ({
	actions,
	onSelect,
	ariaLabel,
}: FoundationSendrKebabProps): JSX.Element => {
	const [open, setOpen] = useState(false);
	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<span
			style={{ float: "right", marginLeft: 8 }}
			onClick={(e) => e.stopPropagation()}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<IconButton
						icon="icon-regular-three-dots-vertical"
						ariaLabel={ariaLabel}
						variant="Standard"
						size="Small"
						isCircular
					/>
				</PopoverTrigger>
				<PopoverContent side="bottom" align="end" ariaLabel={ariaLabel}>
					<Menu size="Small">
						{actions.map((action) => {
							const iconName = isMetaActionIcon(action.actionIcon)
								? metaActionIconMap[action.actionIcon]
								: undefined;
							return (
								<MenuItem
									key={action.label.text}
									value={action.label.text}
									title={action.label.text}
									leading={iconName ? <Icon name={iconName} /> : undefined}
									onSelect={() => {
										setOpen(false);
										onSelect(action);
									}}
								/>
							);
						})}
					</Menu>
				</PopoverContent>
			</Popover>
		</span>
	);
};

export default FoundationSendrKebab;
