import { ExperimentationService } from "Roblox";
import {
	accountSwitcherLayerName,
	foundationAccountSwitcherListParameter,
} from "../constants/accountSwitcherConstants";
import type { AccountSwitcherListVariant } from "../components/FoundationAccountSwitcherList";

export const getAccountSwitcherListVariantFromExperimentValues = (values: {
	[foundationAccountSwitcherListParameter]?: unknown;
}): AccountSwitcherListVariant =>
	values[foundationAccountSwitcherListParameter] === true
		? "foundation"
		: "legacy";

export const getAccountSwitcherListVariant =
	async (): Promise<AccountSwitcherListVariant> => {
		try {
			const experimentParameterValues =
				await ExperimentationService?.getAllValuesForLayer(
					accountSwitcherLayerName,
				);
			return getAccountSwitcherListVariantFromExperimentValues(
				experimentParameterValues ?? {},
			);
		} catch {
			return "legacy";
		}
	};
