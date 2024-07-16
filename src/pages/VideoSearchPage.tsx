import { useSearchParams } from "react-router-dom";

export const VideoSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    return <> {searchParams.get("title")}</>;
};
