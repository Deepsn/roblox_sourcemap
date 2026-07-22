import { QueueItem } from "@rbx/core-scripts/util/batch-request";
import { defaultThumbnailRequester } from "../util/thumbnailRequester";
import {
	batchRequestHandler,
	universeThumbnailHandler,
} from "../util/thumbnailHandler";
import {
	isAvatarHeadshotBackgroundInTreatmentFromCache,
	prefetchAvatarHeadshotBackgroundExperiment,
	resolveAvatarHeadshotIncludeBackground,
} from "../experimentation/avatarHeadshotBackgroundExperiment";
import {
	ThumbnailTypes,
	ThumbnailStates,
	ThumbnailAssetsSize,
	ThumbnailGameIconSize,
	ThumbnailGamePassIconSize,
	ThumbnailGameThumbnailSize,
	ThumbnailUniverseThumbnailSize,
	ThumbnailGroupIconSize,
	ThumbnailBadgeIconSize,
	ThumbnailDeveloperProductIconSize,
	ThumbnailAvatarsSize,
	ThumbnailFormat,
	ThumbnailAvatarHeadshotSize,
	ThumbnailQueueItem,
} from "../constants/thumbnail2dConstant";

const WEBP_SUPPORT_DATA_URI =
	"data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==";

let isWebPSupportedPromise: Promise<boolean> | undefined;

const isWebPSupported = () => {
	if (isWebPSupportedPromise === undefined) {
		isWebPSupportedPromise = new Promise((resolve) => {
			try {
				const img = new Image();
				img.onload = () => resolve(img.width > 0 && img.height > 0);
				img.onerror = () => resolve(false);
				img.src = WEBP_SUPPORT_DATA_URI;
			} catch (_error) {
				resolve(true);
			}
		});
	}

	return isWebPSupportedPromise;
};

// Test for WebP support at runtime, as we still support MacOS 10.x which doesn't support WebP.
const resolveThumbnailFormat = (
	format: ThumbnailFormat,
): Promise<ThumbnailFormat> => {
	if (format !== ThumbnailFormat.webp) {
		return Promise.resolve(format);
	}

	return isWebPSupported().then((isSupported) =>
		isSupported ? ThumbnailFormat.webp : ThumbnailFormat.png,
	);
};

const loadThumbnailImage = (
	thumbnailType: ThumbnailTypes,
	size:
		| ThumbnailAssetsSize
		| ThumbnailGameIconSize
		| ThumbnailGameThumbnailSize
		| ThumbnailUniverseThumbnailSize
		| ThumbnailGamePassIconSize
		| ThumbnailAvatarsSize
		| ThumbnailAvatarHeadshotSize
		| ThumbnailGroupIconSize
		| ThumbnailBadgeIconSize
		| ThumbnailDeveloperProductIconSize,
	format: ThumbnailFormat = ThumbnailFormat.webp,
	targetId?: number,
	token?: string,
	clearCachedValue?: boolean,
	version?: number,
	headShape?: string,
	includeBackground?: boolean,
) => {
	if (!targetId && !token) {
		return new Promise((_resolve, reject) => {
			reject(new Error("TargetId or token can not be empty."));
		});
	}

	// TODO: old, migrated code
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!thumbnailType) {
		return new Promise((_resolve, reject) => {
			reject(new Error("ThumbnailType can not be empty."));
		});
	}

	// TODO: old, migrated code
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-param-reassign
	format ??= ThumbnailFormat.webp;

	// Temp solution to override game icon request format for security purpose
	let formatOverride = format;
	if (
		thumbnailType === ThumbnailTypes.gameIcon ||
		thumbnailType === ThumbnailTypes.gameThumbnail ||
		thumbnailType === ThumbnailTypes.placeGameIcon ||
		thumbnailType === ThumbnailTypes.universeThumbnail
	) {
		formatOverride = ThumbnailFormat.webp;
	}

	// Warm the treatment cache (single-flight) only when an AvatarHeadshot might
	// rely on the experiment, so headshot-less pages issue no IXP request.
	if (
		thumbnailType === ThumbnailTypes.avatarHeadshot &&
		includeBackground === undefined
	) {
		prefetchAvatarHeadshotBackgroundExperiment();
	}

	const resolvedIncludeBackground = resolveAvatarHeadshotIncludeBackground(
		thumbnailType,
		includeBackground,
		isAvatarHeadshotBackgroundInTreatmentFromCache(),
	);

	return resolveThumbnailFormat(formatOverride).then(
		(resolvedFormat: ThumbnailFormat) => {
			const item = {
				targetId,
				token,
				type: thumbnailType,
				format: resolvedFormat,
				size,
				version,
				headShape,
				// Only include the param when enabled so the request omits it for the default case.
				...(resolvedIncludeBackground ? { includeBackground: true } : {}),
			};

			const customHandler = [
				ThumbnailTypes.universeThumbnails,
				ThumbnailTypes.universeThumbnail,
			];
			// null requesterKey creates new batch request processor.
			const requesterKey = !customHandler.includes(thumbnailType)
				? "thumbnail2dProcessor"
				: "universeThumbnailProcessor";
			return defaultThumbnailRequester.processThumbnailBatchRequest(
				item,
				(items: QueueItem<ThumbnailQueueItem>[]) => {
					if (thumbnailType === ThumbnailTypes.universeThumbnail) {
						return universeThumbnailHandler.handle(items, 1);
					}

					if (thumbnailType === ThumbnailTypes.universeThumbnails) {
						return universeThumbnailHandler.handle(items, 10);
					}

					return batchRequestHandler.handle(items);
				},
				requesterKey,
				clearCachedValue,
			);
		},
	);
};

const getThumbnailImage = (
	thumbnailType: ThumbnailTypes,
	size:
		| ThumbnailAssetsSize
		| ThumbnailGameIconSize
		| ThumbnailGameThumbnailSize
		| ThumbnailUniverseThumbnailSize
		| ThumbnailGamePassIconSize
		| ThumbnailAvatarsSize
		| ThumbnailAvatarHeadshotSize
		| ThumbnailGroupIconSize
		| ThumbnailBadgeIconSize
		| ThumbnailDeveloperProductIconSize,
	format: ThumbnailFormat = ThumbnailFormat.webp,
	targetId?: number,
	token?: string,
	version?: number,
	headShape?: string,
	includeBackground?: boolean,
) =>
	loadThumbnailImage(
		thumbnailType,
		size,
		format,
		targetId,
		token,
		false,
		version,
		headShape,
		includeBackground,
	);

const reloadThumbnailImage = (
	thumbnailType: ThumbnailTypes,
	size:
		| ThumbnailAssetsSize
		| ThumbnailGameIconSize
		| ThumbnailGameThumbnailSize
		| ThumbnailUniverseThumbnailSize
		| ThumbnailGamePassIconSize
		| ThumbnailAvatarsSize
		| ThumbnailAvatarHeadshotSize
		| ThumbnailGroupIconSize
		| ThumbnailBadgeIconSize
		| ThumbnailDeveloperProductIconSize,
	format: ThumbnailFormat = ThumbnailFormat.webp,
	targetId?: number,
	token?: string,
	version?: number,
	headShape?: string,
	includeBackground?: boolean,
) =>
	loadThumbnailImage(
		thumbnailType,
		size,
		format,
		targetId,
		token,
		true,
		version,
		headShape,
		includeBackground,
	);

const getCssClass = (thumbnailState: ThumbnailStates) => ({
	"icon-broken": thumbnailState === ThumbnailStates.error,
	"icon-in-review": thumbnailState === ThumbnailStates.inReview,
	"icon-blocked": thumbnailState === ThumbnailStates.blocked,
	"icon-pending": thumbnailState === ThumbnailStates.pending,
});

export { getThumbnailImage, getCssClass, reloadThumbnailImage };
