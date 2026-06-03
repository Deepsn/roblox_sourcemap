import { useMemo } from "react";
import domPurify from "dompurify";

const DOM_PURIFY_CONFIG = { ADD_ATTR: ["target"] };

/**
 * Sanitize HTML link text to prevent XSS attacks.
 *
 * Used for BE-driven HTML link text that must be sanitized before rendering in the UI.
 */
const useSanitizedHtmlLinkText = (html: string): string => {
	return useMemo(() => {
		return domPurify.sanitize(html, DOM_PURIFY_CONFIG);
	}, [html]);
};

export default useSanitizedHtmlLinkText;
