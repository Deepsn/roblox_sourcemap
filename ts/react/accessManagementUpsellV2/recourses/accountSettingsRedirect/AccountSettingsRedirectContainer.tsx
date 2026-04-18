import React, { useEffect, useMemo, useState } from "react";
import { withTranslations, WithTranslationsProps } from "react-utilities";
import { Modal } from "react-style-guide";
import { Button } from "@rbx/foundation-ui";
import { accountSettingsRedirectTranslationConfig } from "../../app.config";
import accessManagementUpsellConstants from "../../../accessManagementUpsell/constants/accessManagementUpsellConstants";

const translationKeys = {
	title: "Modal.Title",
	message: "Modal.ContentText",
	cancel: "Button.Cancel",
	settings: "Button.Settings",
};

const AccountSettingsRedirectContainer = ({
	translate,
	onHide,
}: {
	translate: WithTranslationsProps["translate"];
	onHide: () => void;
}): JSX.Element => {
	const [modalOpen, setModalOpen] = useState(false);

	const modalService = useMemo(
		() => ({
			open: () => setModalOpen(true),
			close: () => setModalOpen(false),
		}),
		[],
	);

	useEffect(() => {
		modalService.open();
	}, []);

	const handleCancel = () => {
		modalService.close();
		onHide();
	};

	const modal = (
		<Modal
			show={modalOpen}
			onHide={handleCancel}
			backdrop
			className="access-management-upsell-inner-modal account-settings-redirect-modal"
			aria-labelledby="account-settings-redirect-modal-title"
			scrollable
			centered
		>
			<Modal.Header useBaseBootstrapComponent>
				<div className="account-settings-redirect-modal-title-container">
					<Modal.Title id="account-settings-redirect-modal-title">
						{translate(translationKeys.title)}
					</Modal.Title>
				</div>
				<button
					type="button"
					className="close close-button"
					title={translate(translationKeys.cancel)}
					onClick={handleCancel}
				>
					<span className="icon-close" />
				</button>
			</Modal.Header>
			<Modal.Body>{translate(translationKeys.message)}</Modal.Body>
			<Modal.Footer>
				<Button
					className="modal-half-width-button"
					variant="Standard"
					size="Medium"
					onClick={handleCancel}
				>
					{translate(translationKeys.cancel)}
				</Button>
				<Button
					as="a"
					href={accessManagementUpsellConstants.accountSettingsPath}
					className="modal-half-width-button modal-primary-button"
					variant="Emphasis"
					size="Medium"
				>
					{translate(translationKeys.settings)}
				</Button>
			</Modal.Footer>
		</Modal>
	);

	return <div>{modal}</div>;
};

export default withTranslations(
	AccountSettingsRedirectContainer,
	accountSettingsRedirectTranslationConfig,
);
