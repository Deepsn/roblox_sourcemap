import { useInfiniteQuery } from "@tanstack/react-query";
import { httpService } from "core-utilities";
import {
	StreamNotification,
	getRecentUrlConfig,
	PAGE_SIZE,
} from "./notificationStreamApi";
import { reportNotificationStreamError } from "./notificationStreamObservability";

export const GET_RECENT_QUERY_KEY = ["notification-stream-get-recent"];

const byEventDateDesc = (
	a: StreamNotification,
	b: StreamNotification,
): number => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();

const fetchPage = (startIndex: number): Promise<StreamNotification[]> =>
	httpService
		.get<StreamNotification[]>(getRecentUrlConfig(startIndex))
		.then(({ data }) => data ?? []);

export const useGetRecentNotifications = (): ReturnType<
	typeof useInfiniteQuery<StreamNotification[]>
> & {
	notifications: StreamNotification[];
	gameUpdates: StreamNotification[];
} => {
	const query = useInfiniteQuery<StreamNotification[]>({
		queryKey: GET_RECENT_QUERY_KEY,
		queryFn: ({ pageParam = 0 }) => fetchPage(pageParam as number),
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length < PAGE_SIZE ? undefined : allPages.length * PAGE_SIZE,
		staleTime: Infinity,
		// The shell unmounts when the popover closes; the global queryClient default is
		// refetchOnMount:false, so without this a reopen would serve the permanently-cached
		// (staleTime:Infinity) first page and miss notifications that arrived while closed.
		refetchOnMount: "always",
		onError: (error) => reportNotificationStreamError("getRecent", error),
	});

	const all = (query.data?.pages ?? []).flat();
	const gameUpdates = all
		.filter((n) => n.notificationSourceType === "GameUpdate")
		.sort(byEventDateDesc);
	const notifications = all
		.filter((n) => n.notificationSourceType !== "GameUpdate")
		.sort(byEventDateDesc);

	return { ...query, notifications, gameUpdates };
};

export default useGetRecentNotifications;
