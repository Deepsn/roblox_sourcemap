import Configuration from './Configuration';

export interface TrackerRequest {
  target: string;
  eventType: string;
  context: string;
  localTime: Date;
  currentUrl?: string;
  additionalProperties?: Record<string, string | number | boolean | undefined>;
  guestId?: string;
  sessionId?: string;
}

export interface TrackerResponse {
  url: string;
}

class Tracker {
  private baseUrl: string;

  constructor(protected configuration = new Configuration()) {
    this.baseUrl = configuration.baseUrl;
  }

  // TODO: deprecated method, remove it until we rollout usage to sendEventViaImg
  sendEvent(requestParameters: TrackerRequest): Promise<TrackerResponse> {
    const {
      localTime,
      target,
      eventType,
      context,
      additionalProperties,
      currentUrl,
      guestId,
      sessionId,
    } = requestParameters;
    const lt = localTime.toISOString();
    const url = new URL(`${this.baseUrl}/pe`);

    url.searchParams.append('t', target);
    url.searchParams.append('evt', eventType);
    url.searchParams.append('ctx', context);
    url.searchParams.append('lt', lt);
    url.searchParams.append('url', currentUrl || window.location.href);

    // optional
    if (typeof guestId !== 'undefined') {
      url.searchParams.append('gid', guestId);
    }
    if (typeof sessionId !== 'undefined') {
      url.searchParams.append('sid', sessionId);
    }
    if (typeof additionalProperties !== 'undefined') {
      Object.keys(additionalProperties).forEach((key) => {
        url.searchParams.append(key, (additionalProperties[key] ?? '').toString());
      });
    }

    return fetch(url.href, { credentials: 'same-origin' });
  }

  // TODO: The reason we take image object approach instead of api endpoint
  // request is due to the CORS limitation on endpoint. Before data team has the
  // new REST API created (2022), we need to stay this approach
  sendEventViaImg(
    requestParameters: TrackerRequest,
    callback?: (status: boolean) => void,
  ): HTMLImageElement {
    const {
      localTime,
      target,
      eventType,
      context,
      additionalProperties,
      currentUrl,
      guestId,
      sessionId,
    } = requestParameters;
    const lt = localTime.toISOString();
    const url = new URL(`${this.baseUrl}/e.png`);

    url.searchParams.append('t', target);
    url.searchParams.append('evt', eventType);
    url.searchParams.append('ctx', context);
    url.searchParams.append('lt', lt);
    url.searchParams.append('url', currentUrl || window.location.href);

    // optional
    if (guestId !== undefined) {
      url.searchParams.append('gid', guestId);
    }
    if (sessionId !== undefined) {
      url.searchParams.append('sid', sessionId);
    }
    if (additionalProperties !== undefined) {
      Object.keys(additionalProperties).forEach((key) => {
        url.searchParams.append(key, (additionalProperties[key] ?? '').toString());
      });
    }
    const img = new Image();
    img.src = url.href;
    img.onload = () => {
      if (typeof callback !== 'undefined') {
        callback(true);
      }
    };

    img.onerror = () => {
      if (typeof callback !== 'undefined') {
        callback(false);
      }
    };
    return img;
  }
}

export default Tracker;
