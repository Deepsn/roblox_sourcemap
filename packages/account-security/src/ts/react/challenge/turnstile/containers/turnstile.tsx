import { Turnstile } from "@marsidev/react-turnstile";
import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import InlineChallenge from "../../../common/inlineChallenge";
import InlineChallengeBody from "../../../common/inlineChallengeBody";
import useTurnstileContext from "../hooks/useTurnstileContext";
import { ErrorCode } from "../interface";
import { TurnstileActionType } from "../store/action";

/**
 * A container element for the Turnstile UI.
 */
const TurnstileV1: React.FC = () => {
	const {
		state: {
			siteKey,
			renderInline,
			resources,
			isModalVisible,
			onChallengeCompletedData,
			onChallengeInvalidatedData,
			isAbandoned,
		},
		dispatch,
	} = useTurnstileContext();

	const closeModal = useCallback(() => {
		dispatch({ type: TurnstileActionType.HIDE_MODAL_CHALLENGE });
		// Let the abandoned effect in the context provider fire
		// `onModalChallengeAbandoned`.
		dispatch({ type: TurnstileActionType.SET_CHALLENGE_ABANDONED });
	}, [dispatch]);

	const onComplete = useCallback(
		(token: string) => {
			// Hide the modal (if any) now that the challenge is solved. This uses the
			// same action as the close button, and is a no-op for the inline case.
			dispatch({ type: TurnstileActionType.HIDE_MODAL_CHALLENGE });
			dispatch({
				type: TurnstileActionType.SET_CHALLENGE_COMPLETED,
				onChallengeCompletedData: { turnstileToken: token },
			});
		},
		[dispatch],
	);

	const onError = useCallback(
		(errorMessage: string) => {
			dispatch({
				type: TurnstileActionType.SET_CHALLENGE_INVALIDATED,
				onChallengeInvalidatedData: {
					errorMessage,
					errorCode: ErrorCode.UNKNOWN,
				},
			});
		},
		[dispatch],
	);

	// Cloudflare fires this immediately before it needs to prompt the user for
	// interaction. It only fires for interactive sessions, so we use it as the
	// single signal to reveal the dialog. Invisible and non-interactive sessions
	// never fire it and therefore show no UI at all.
	const onBeforeInteractive = useCallback(() => {
		dispatch({ type: TurnstileActionType.SHOW_MODAL_CHALLENGE });
	}, [dispatch]);

	// Escape dismisses the modal (abandoning the challenge), matching the
	// behavior of the previous Foundation `Dialog`. Only active while visible.
	useEffect(() => {
		if (!isModalVisible) {
			return undefined;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeModal();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isModalVisible, closeModal]);

	// Tear down the whole module once the challenge reaches a terminal state —
	// solved, invalidated (error / expire / timeout / unsupported), or abandoned.
	// The widget and modal must not re-mount or re-appear for the rest of this
	// challenge's lifecycle; this also prevents the off-screen widget from
	// re-firing `onBeforeInteractive` and re-opening the modal after dismissal.
	// The terminal callbacks (completed / invalidated / abandoned) still fire
	// from the context provider's effects, which are unaffected by rendering
	// `null` here. A new challenge — including re-triggering the flow after an
	// abandon — mounts a fresh instance via `renderChallenge`.
	if (
		onChallengeCompletedData !== null ||
		onChallengeInvalidatedData !== null ||
		isAbandoned
	) {
		return null;
	}

	const turnstileBody = (
		<div className="flex justify-center">
			<Turnstile
				siteKey={siteKey}
				// Keep the widget invisible unless interaction is actually required.
				options={{ appearance: "interaction-only" }}
				onBeforeInteractive={onBeforeInteractive}
				onError={() => onError("error")}
				onExpire={() => onError("expire")}
				onTimeout={() => onError("timeout")}
				onUnsupported={() => onError("unsupported")}
				onSuccess={onComplete}
			/>
		</div>
	);

	if (renderInline) {
		/*
		 * Mirror the modal path's visibility model: keep the widget mounted at all
		 * times (Cloudflare still evaluates while `display:none`), but reveal no
		 * UI at all — not even the title — until interaction is actually required.
		 * Invisible / non-interactive sessions never fire `onBeforeInteractive`, so
		 * `isModalVisible` stays false and nothing is shown; they simply resolve via
		 * `onSuccess` (or error). Only interactive sessions flip `isModalVisible`
		 * true and reveal the title + widget. Hiding via CSS (never unmounting)
		 * keeps the `<Turnstile>` widget from being reparented/remounted.
		 */
		return (
			<div className={isModalVisible ? undefined : "hidden"}>
				<InlineChallenge
					titleText={resources.Description.VerifyingYouAreNotBot}
				>
					<InlineChallengeBody>{turnstileBody}</InlineChallengeBody>
				</InlineChallenge>
			</div>
		);
	}

	if (typeof document === "undefined") {
		return null;
	}

	/*
	 * The Turnstile widget must be mounted exactly once and NEVER reparented.
	 * Moving it between DOM containers (for example, in and out of a Foundation
	 * `Dialog` or a `react-style-guide` `Modal`, both of which unmount their
	 * children while closed) forces React to unmount the old `<Turnstile>` and
	 * mount a brand-new one.
	 */
	return createPortal(
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
		<div
			data-testid="turnstile-challenge-modal"
			className={
				isModalVisible
					? "fixed inset-[0] flex items-center justify-center bg-[var(--color-common-backdrop)] [z-index:1050]"
					: "hidden"
			}
			onClick={
				isModalVisible
					? (event) => {
							// Mimic the Foundation `Dialog`: a click on the backdrop itself
							// (not the card/widget) dismisses and abandons the challenge.
							if (event.target === event.currentTarget) {
								closeModal();
							}
						}
					: undefined
			}
		>
			<div className="flex flex-col items-center max-width-[90vw] radius-medium padding-xxlarge bg-surface-100 [box-shadow:0_8px_24px_var(--color-common-shadow)]">
				{/*
				 * Rendered only when visible; kept before the widget which always
				 * stays at a stable position, so toggling the title never remounts it.
				 */}
				{isModalVisible && (
					<div className="margin-bottom-[var(--size-400)] text-title-large text-align-x-center content-emphasis">
						{resources.Description.VerifyingYouAreNotBot}
					</div>
				)}
				{turnstileBody}
			</div>
		</div>,
		document.body,
	);
};

export default TurnstileV1;
