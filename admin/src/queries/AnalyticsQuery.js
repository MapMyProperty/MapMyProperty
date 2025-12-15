import { useQuery } from "react-query";
import { getAnalytics } from "./productUrls";

const useGetAnalytics = () => {
    return useQuery(["get_Analytics"], () => getAnalytics(), {
        staleTime: 60000, // 1 minute
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};

export { useGetAnalytics };
