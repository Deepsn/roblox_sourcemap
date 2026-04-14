import type { BrowserOptions } from "@sentry/browser";

type BeforeSendTransactionCallback = NonNullable<
	BrowserOptions["beforeSendTransaction"]
>;
export type Transaction = Parameters<BeforeSendTransactionCallback>[0];

const CDN_DOMAINS = [
	"css.rbxcdn.com",
	"static.rbxcdn.com",
	"js.rbxcdn.com",
	"tr.rbxcdn.com",
	"metrics.roblox.com",
	"images.rbxcdn.com",
] as const;

/**
 * Hosts where we keep `resource.script` / `resource.css` spans so Sentry Assets and
 * dashboards can measure first-party bundle weight. Other `resource.*` types on these
 * hosts (e.g. images) and all `http.client` spans to CDN hosts are still stripped.
 */
const FIRST_PARTY_BUNDLE_RESOURCE_DOMAINS = [
	"js.rbxcdn.com",
	"css.rbxcdn.com",
	"static.rbxcdn.com",
] as const;

function urlMatchesAnyDomain(url: string, domains: readonly string[]): boolean {
	return domains.some((domain) => url.includes(domain));
}

function shouldRetainFirstPartyResourceSpan(
	op: string | undefined,
	url: string,
): boolean {
	if (op !== "resource.script" && op !== "resource.css") {
		return false;
	}
	return urlMatchesAnyDomain(url, FIRST_PARTY_BUNDLE_RESOURCE_DOMAINS);
}

/**
 * Filters out spans from CDN domains to reduce noise in Sentry traces.
 * Drops `http.client` and most `resource.*` spans targeting listed CDN domains.
 * Preserves `resource.script` / `resource.css` for first-party bundle hosts (js/css/static).
 * Thumbnail resizer CDN (`tr.rbxcdn.com`) stays fully filtered — it is not web bundle traffic.
 * so Explore and performance dashboards can aggregate real user bundle data.
 *
 * Span volume / quota: coordinate with observability owners before broad rollout; see
 * https://roblox.atlassian.net/wiki/spaces/UB/pages/3909976268/Sentry+Spans+Noise+Reduction
 *
 * @param transaction - The Sentry transaction to filter
 * @returns The transaction with CDN spans filtered out
 */
export function filterCdnSpans(transaction: Transaction): Transaction {
	if (!transaction.spans) {
		return transaction;
	}

	const filteredSpans = transaction.spans.filter((span) => {
		const url = span.description ?? span.data.url;
		if (typeof url !== "string") {
			return true;
		}

		if (span.op === "http.client") {
			return !urlMatchesAnyDomain(url, CDN_DOMAINS);
		}

		if (span.op?.startsWith("resource.")) {
			if (shouldRetainFirstPartyResourceSpan(span.op, url)) {
				return true;
			}
			return !urlMatchesAnyDomain(url, CDN_DOMAINS);
		}

		return true;
	});

	return {
		...transaction,
		spans: filteredSpans,
	};
}
