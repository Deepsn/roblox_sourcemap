import environmentUrls from "@rbx/environment-urls";
import { get, post } from "../../http";
import { sendDurableReplayEvent } from "../utils/events";

const REPLAY_CONFIG_URL = `${environmentUrls.apiGatewayUrl}/realtime-replay-api/v1/config`;
const REPLAY_URL = `${environmentUrls.apiGatewayUrl}/realtime-replay-api/v1/replay`;

interface DurableReplayerOptions {
	getLastSeenSequenceNumbers: () => Record<string, number>;
	processNotification: (
		namespace: string,
		detail: unknown,
		seqNum: number,
	) => void;
	updateSequenceNumber: (namespace: string, seqNum: number) => void;
	log: (message: string) => void;
}

interface ConfigNamespaceSettings {
	maxNotifsReplayed: number;
}

interface ReplayConfigResponse {
	namespaces?: Record<string, ConfigNamespaceSettings>;
}

interface ReplayNotificationEntry {
	namespace: string;
	detail: string;
	sequenceNumber: number;
}

interface ReplayResponse {
	notifications: ReplayNotificationEntry[];
	namespacesWithGap: string[];
	updatedSequenceNumbers: Record<string, number>;
}

export interface DurableReplayer {
	fetchConfig: () => Promise<void>;
	maybeRequestReplay: () => Promise<void>;
	isDurableNamespace: (namespace: string) => boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const createDurableReplayer = ({
	getLastSeenSequenceNumbers,
	processNotification,
	updateSequenceNumber,
	log,
}: DurableReplayerOptions): DurableReplayer => {
	let durableNamespaceConfig: Record<string, ConfigNamespaceSettings> | null =
		null;
	let isReplayInFlight = false;

	const isDurableNamespace = (namespace: string): boolean => {
		return (
			durableNamespaceConfig != null && namespace in durableNamespaceConfig
		);
	};

	const applyUpdatedSequenceNumbers = (
		updatedSequenceNumbers: Record<string, number> | undefined,
		namespacesWithGap: string[] | undefined,
	): void => {
		if (!updatedSequenceNumbers) {
			return;
		}

		const gapSet = new Set(namespacesWithGap ?? []);

		for (const [namespace, serverSeqNum] of Object.entries(
			updatedSequenceNumbers,
		)) {
			const hasGap = gapSet.has(namespace);
			const serverIsAhead =
				serverSeqNum > (getLastSeenSequenceNumbers()[namespace] ?? 0);

			if (hasGap || serverIsAhead) {
				updateSequenceNumber(namespace, serverSeqNum);
			}
		}
	};

	const processReplayResponse = (responseData: ReplayResponse): void => {
		const { notifications, namespacesWithGap, updatedSequenceNumbers } =
			responseData;

		if (notifications.length > 0) {
			for (const entry of notifications) {
				if (!entry.namespace || !entry.detail) {
					continue;
				}

				let detail: Record<string, unknown>;
				try {
					const parsed: unknown = JSON.parse(entry.detail);
					if (!isRecord(parsed)) {
						continue;
					}
					detail = parsed;
				} catch {
					continue;
				}

				processNotification(entry.namespace, detail, entry.sequenceNumber);
			}
		}

		if (namespacesWithGap.length > 0) {
			sendDurableReplayEvent("GapDetected");
		}

		applyUpdatedSequenceNumbers(updatedSequenceNumbers, namespacesWithGap);
	};

	const maybeRequestReplay = async (): Promise<void> => {
		if (
			!durableNamespaceConfig ||
			Object.keys(durableNamespaceConfig).length === 0
		) {
			return;
		}

		if (isReplayInFlight) {
			return;
		}

		isReplayInFlight = true;

		try {
			const lastSeen = getLastSeenSequenceNumbers();
			const namespaceLastSeenSequenceNumbers: Record<string, number> = {};

			for (const namespace of Object.keys(durableNamespaceConfig)) {
				namespaceLastSeenSequenceNumbers[namespace] = lastSeen[namespace] ?? 0;
			}

			sendDurableReplayEvent("RequestSent");

			const response = await post<ReplayResponse>(
				{ url: REPLAY_URL, withCredentials: true },
				{ namespaceLastSeenSequenceNumbers },
			);

			processReplayResponse(response.data);
			sendDurableReplayEvent("RequestSuccess");
		} catch (e: unknown) {
			sendDurableReplayEvent("RequestFailure");
			log(`[DurableReplayer] replay request failed: ${String(e)}`);
		} finally {
			isReplayInFlight = false;
		}
	};

	const fetchConfig = async (): Promise<void> => {
		try {
			const response = await get<ReplayConfigResponse>({
				url: REPLAY_CONFIG_URL,
				withCredentials: true,
			});
			const { namespaces } = response.data;
			if (namespaces) {
				durableNamespaceConfig = namespaces;
				sendDurableReplayEvent("ConfigFetchSuccess");
				maybeRequestReplay().catch(() => undefined);
			}
		} catch (e: unknown) {
			sendDurableReplayEvent("ConfigFetchFailure");
			log(`[DurableReplayer] fetchConfig failed: ${String(e)}`);
		}
	};

	return {
		fetchConfig,
		maybeRequestReplay,
		isDurableNamespace,
	};
};

export default createDurableReplayer;
