import {useEffect, useRef} from "react";
import Vditor from "vditor";

interface MdPreviewProps {
    content: string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    padding?: number | string;
}

export const MdPreview: React.FC<MdPreviewProps> = ({
                                                        content,
                                                        maxHeight = window.innerHeight * 0.7,
                                                        maxWidth = "100%",
                                                        padding=0,
                                                    }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (previewRef.current) {
            Vditor.preview(previewRef.current, content, {
                mode: "light",
            });
        }
    }, [content]);

    return (
        <div
            ref={previewRef}
            className="vditor"
            style={{
                maxHeight: maxHeight,
                overflowY: "scroll",
                padding: padding,
                maxWidth: maxWidth,
                border: "none"
            }}
        />
    );
};