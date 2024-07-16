export const formatDate = (rawDate: string): string => {
    const date = new Date(rawDate);
    const formattedDate =
        date.toLocaleDateString("zh-Hans-CN") +
        " " +
        date.toLocaleTimeString();
    return formattedDate;
}