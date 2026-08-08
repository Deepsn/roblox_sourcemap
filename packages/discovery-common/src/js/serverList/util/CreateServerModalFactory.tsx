/* eslint-disable react/jsx-no-literals */
import React, {
	useMemo,
	useState,
	useEffect,
	type ComponentType,
	type ReactNode,
	type ChangeEvent,
} from "react";
import { renderToString } from "react-dom/server";
import {
	withTranslations,
	type TranslateFunction,
} from "@rbx/core-scripts/react";
import { createModal } from "@rbx/core-ui";
import { CurrentUser } from "@rbx/legacy-webapp-types/Roblox";
import translationConfig from "../translation.config";
import serverListConstants from "../constants/serverListConstants";
import urlConstants from "../constants/urlConstants";
import serverListService from "../services/serverListService";

type ModalService = ReturnType<typeof createModal>[1];

// createModal's .d.ts types are narrower than the runtime API (e.g. footerText is string, not ReactNode)
const [Modal, modalService] = createModal() as [
	React.ComponentType<Record<string, unknown>>,
	ModalService,
];

const { resources, serverNameMaxLength } = serverListConstants;

interface CreateServerModalProps {
	translate: TranslateFunction;
	privateServerTranslate: TranslateFunction;
	assetName: string;
	expectedPrice: number;
	thumbnail: ReactNode;
	serverName: string;
	onAction: () => void;
	onServerNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
	clearForm: () => void;
	loading: boolean;
}

type CreateServerModalExternalProps = Omit<
	CreateServerModalProps,
	"translate" | "privateServerTranslate"
>;

export default (): [
	ComponentType<CreateServerModalExternalProps>,
	ModalService,
] => {
	function CreateServerModal({
		translate,
		privateServerTranslate,
		assetName,
		expectedPrice,
		thumbnail,
		serverName,
		onAction,
		onServerNameChange,
		clearForm,
		loading,
	}: CreateServerModalProps) {
		const { BalanceAfterSaleText, PriceLabel } =
			window.RobloxItemPurchase as typeof window.RobloxItemPurchase & {
				BalanceAfterSaleText: React.ComponentType<{ expectedPrice: number }>;
				PriceLabel: React.ComponentType<{ price: number }>;
			};
		const perMonthLabel =
			privateServerTranslate(resources.perMonthText) || "/month";

		const actionButtonText = useMemo(() => {
			if (expectedPrice !== 0) {
				return translate(resources.subscribeText) || "Subscribe";
			}
			return translate(resources.buyNowText);
		}, [expectedPrice, translate]);

		const modalFooterText = (
			<span className="purchase-private-server-modal-footer-text">
				<BalanceAfterSaleText expectedPrice={expectedPrice} />{" "}
				{privateServerTranslate(resources.createServerFooterDescription) ||
					"This is a subscription-based feature. It will auto-renew once a month until you cancel the subscription."}
			</span>
		);

		const [checked, setChecked] = useState(false);
		const [displayPrivacyDisclaimer, setDisplayPrivacyDisclaimer] =
			useState(false);
		const [userEnabledForPSPv2, setuserEnabledForPSPv2] = useState(false);
		const privateSettingNoOne = "NoOne";

		const handleAction = () => {
			setChecked(false);
			return onAction();
		};

		const handleNeutral = () => {
			setChecked(false);
			return clearForm();
		};

		const privacySettingsLink = `<a id='redirect-link' href=${urlConstants.accountsSettingsPageUrl()}>${privateServerTranslate(
			resources.privacySettingsText,
		)}</a>`;

		useEffect(() => {
			if (CurrentUser.isUnder13) {
				serverListService.getUserSettings().then(
					(userSettingsData) => {
						if (userSettingsData) {
							setDisplayPrivacyDisclaimer(
								userSettingsData?.privateServerPrivacy === privateSettingNoOne,
							);
						}
					},
					() => {
						// do nothing
					},
				);
			}
		}, []);

		useEffect(() => {
			serverListService.getAccountSettingsGuacPolicy().then(
				(guacPolicy) => {
					if (guacPolicy) {
						setuserEnabledForPSPv2(
							Boolean(guacPolicy.isPrivateServerPrivacyV2Enabled),
						);
					}
				},
				() => {
					// do nothing
				},
			);
		}, []);
		const modalBody = (
			<div className="private-server-purchase">
				<div
					className="modal-list-item private-server-main-text"
					// There is no danger here as we are only displaying text with this inner html.
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: privateServerTranslate(
							resources.createPrivateServerPriceText,
							{
								target: `${renderToString(<PriceLabel {...{ price: expectedPrice }} />)}${
									expectedPrice !== 0 ? perMonthLabel : ""
								}`,
							},
						),
					}}
				/>
				<div className="modal-list-item">
					<span className="text-label private-server-game-name">
						{privateServerTranslate(resources.gameNameText)}
					</span>
					<span className="game-name">{assetName}</span>
				</div>
				<div className="modal-list-item private-server-name-input">
					<span className="text-label">
						{privateServerTranslate(resources.serverNameText)}
					</span>
					<div className="form-group form-has-feedback">
						<input
							type="text"
							value={serverName}
							onChange={onServerNameChange}
							maxLength={serverNameMaxLength}
							className="form-control input-field private-server-name"
							id="private-server-name-text-box"
						/>
						{serverName.length > 0 && (
							<p className="form-control-label text-secondary">
								{serverName.length}/{serverNameMaxLength}
							</p>
						)}
					</div>
				</div>
				<div className="modal-image-container">{thumbnail}</div>
				{expectedPrice !== 0 && (
					<p className="rbx-private-server-renewal-disclosure">
						{privateServerTranslate(resources.renewsMonthlyText) ||
							"Renews monthly. Cancel anytime."}
					</p>
				)}
				{userEnabledForPSPv2 && displayPrivacyDisclaimer && (
					<div>
						<br />
						<div className="private-settings-disclaimer">
							<span className="private-settings-disclaimer-checkbox">
								<input
									id="privacy-settings-disclaimer-checkbox"
									type="checkbox"
									checked={checked}
									onClick={() => setChecked(!checked)}
								/>
							</span>
							<b>
								<span
									className="private-servers-disclaimer-text"
									// this was need to embedded a redirected link to the privacy page within translated textbox
									dangerouslySetInnerHTML={{
										__html: privateServerTranslate(
											resources.cantJoinPrivacySettingText,
											{
												privacySettingsLink,
											},
										),
									}}
								/>
							</b>
						</div>
					</div>
				)}
			</div>
		);

		return (
			<Modal
				id="purchase-private-server-modal"
				title={privateServerTranslate(resources.createPrivateServerTitle)}
				body={modalBody}
				actionButtonText={actionButtonText}
				neutralButtonText={translate(resources.cancelAction)}
				footerText={modalFooterText}
				onAction={handleAction}
				onNeutral={handleNeutral}
				loading={loading}
				actionButtonShow
				disableActionButton={
					serverName.length === 0 ||
					(displayPrivacyDisclaimer && userEnabledForPSPv2 && !checked)
				}
			/>
		);
	}

	CreateServerModal.defaultProps = {
		serverName: "",
		createServerError: false,
		loading: false,
	};

	return [
		withTranslations(
			CreateServerModal,
			translationConfig.purchaseDialog,
		) as unknown as ComponentType<CreateServerModalExternalProps>,
		modalService,
	];
};
