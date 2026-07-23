import type { AnyRegistry, MakeObservabilityTypes } from "./types";

type Obs<R extends AnyRegistry> = MakeObservabilityTypes<R>;
type DF<R extends AnyRegistry> = Obs<R>["DimensionsFor"];

type TrackCounterFn<R extends AnyRegistry> = <N extends Obs<R>["CounterName"]>(
	...args: DF<R>[N] extends never
		? [name: N]
		: [name: N, dimensions: Record<DF<R>[N], string>]
) => void;

type TrackErrorFn<R extends AnyRegistry> = <N extends Obs<R>["ErrorName"]>(
	...args: DF<R>[N] extends never
		? [name: N, dimensions?: Record<string, string> | null, error?: unknown]
		: [name: N, dimensions: Record<DF<R>[N], string>, error?: unknown]
) => void;

type TrackCriticalErrorFn<R extends AnyRegistry> = <
	N extends Obs<R>["CriticalErrorName"],
>(
	...args: DF<R>[N] extends never
		? [name: N, dimensions?: Record<string, string> | null, error?: unknown]
		: [name: N, dimensions: Record<DF<R>[N], string>, error?: unknown]
) => void;

export type Trackers<R extends AnyRegistry> = {
	trackCounter: TrackCounterFn<R>;
	trackError: TrackErrorFn<R>;
	trackCriticalError: TrackCriticalErrorFn<R>;
};

export type PublishFn = (
	name: string,
	dimensions?: Record<string, string>,
) => void;
export type CaptureExceptionFn = (
	error: unknown,
	tags?: Record<string, string>,
) => void;

export interface CreateTrackersOptions {
	publish: PublishFn;
	captureException?: CaptureExceptionFn;
	featureName?: string;
}

export function createTrackers<R extends AnyRegistry>(
	_registry: R,
	{ publish, captureException, featureName }: CreateTrackersOptions,
): Trackers<R> {
	function withErrorDims(
		name: string,
		dims: Record<string, string>,
		error: unknown,
	): Record<string, string> {
		if (error != null) {
			const errorType =
				error instanceof Error ? error.name || "Error" : "UnknownError";
			const counterName = featureName ? `${featureName}_${name}` : name;
			captureException?.(error, { error_counter: counterName });
			return { ...dims, errorType };
		}
		return dims;
	}

	return {
		trackCounter(...args: unknown[]): void {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			const [name, dimensions] = args as [
				string,
				Record<string, string> | undefined,
			];
			publish(name, dimensions);
		},
		trackError(...args: unknown[]): void {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			const [name, rawDims, error] = args as [
				string,
				Record<string, string> | null | undefined,
				unknown,
			];
			const dims = withErrorDims(
				name,
				{ ...(rawDims ?? {}), severity: "error" },
				error,
			);
			publish(name, dims);
		},
		trackCriticalError(...args: unknown[]): void {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
			const [name, rawDims, error] = args as [
				string,
				Record<string, string> | null | undefined,
				unknown,
			];
			const dims = withErrorDims(
				name,
				{ ...(rawDims ?? {}), severity: "critical" },
				error,
			);
			publish(name, dims);
		},
	};
}
