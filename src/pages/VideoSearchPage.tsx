import { useSearchParams } from "react-router-dom";

export const VideoSearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const title=searchParams.get("title")
    return <> {title}</>;
};
