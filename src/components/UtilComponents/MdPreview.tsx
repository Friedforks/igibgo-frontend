// import {useEffect, useRef} from "react";
// import Vditor from "vditor";
//
// interface MdPreviewProps {
//     content: string;
//     maxHeight?: number | string;
//     maxWidth?: number | string;
//     padding?: number | string;
// }
//
// export const MdPreview: React.FC<MdPreviewProps> = ({
//                                                         content,
//                                                         maxHeight = window.innerHeight * 0.7,
//                                                         maxWidth = "100%",
//                                                         padding = 0,
//                                                     }) => {
//     const previewRef = useRef<HTMLDivElement>(null);
//
//     const outlineRef = useRef<HTMLDivElement>(null);
//     useEffect(() => {
//         if (previewRef.current) {
//             Vditor.preview(previewRef.current, content, {
//                 cdn: "",
//                 mode: "light",
//                 markdown: {
//                     toc: true,
//                 },
//                 math: {
//                     inlineDigit: true,
//                     engine: "MathJax",
//                 },
//                 anchor: 1, after() {
//                     if (outlineRef.current && previewRef.current) {
//                         Vditor.outlineRender(previewRef.current, outlineRef.current);
//                     }
//                 },
//             });
//         }
//     }, [content]);
//
//     return (
//         <>
//             <div
//                 ref={previewRef}
//                 className="vditor"
//                 style={{
//                     maxHeight: maxHeight,
//                     overflowY: "scroll",
//                     padding: padding,
//                     maxWidth: maxWidth,
//                     border: "none"
//                 }}
//             />
//             <div ref={outlineRef} className="outline"/>
//         </>
//     );
// };
// import React, { useEffect, useRef, useState } from "react";
// import Vditor from "vditor";
//
// interface MdPreviewProps {
//     content: string;
//     maxHeight?: number | string;
//     maxWidth?: number | string;
//     padding?: number | string;
// }
//
// export const MdPreview: React.FC<MdPreviewProps> = ({
//                                                         content,
//                                                         maxHeight = window.innerHeight * 0.7,
//                                                         maxWidth = "100%",
//                                                         padding = 0,
//                                                     }) => {
//     const previewRef = useRef<HTMLDivElement>(null);
//     const outlineRef = useRef<HTMLDivElement>(null);
//     const [toc, setToc] = useState<Array<{ id: string; offsetTop: number }>>([]);
//
//     useEffect(() => {
//         if (previewRef.current) {
//             Vditor.preview(previewRef.current, content, {
//                 cdn: "",
//                 mode: "light",
//                 markdown: {
//                     toc: true,
//                 },
//                 math: {
//                     inlineDigit: true,
//                     engine: "MathJax",
//                 },
//                 anchor: 1,
//                 after() {
//                     if (outlineRef.current && previewRef.current) {
//                         Vditor.outlineRender(previewRef.current, outlineRef.current);
//                         initOutline();
//                     }
//                 },
//             });
//         }
//     }, [content]);
//
//     const initOutline = () => {
//         if (!previewRef.current) return;
//
//         const headingElements = Array.from(previewRef.current.children).filter(
//             (item):item is HTMLElement => item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0
//         );
//
//         const newToc = headingElements.map((item) => ({
//             id: item.id,
//             offsetTop: item.offsetTop,
//         }));
//
//         setToc(newToc);
//     };
//
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollTop = window.scrollY;
//             const currentElement = document.querySelector('.vditor-outline__item--current');
//
//             for (let i = 0; i < toc.length; i++) {
//                 if (scrollTop < toc[i].offsetTop - 30) {
//                     if (currentElement) {
//                         currentElement.classList.remove('vditor-outline__item--current');
//                     }
//                     const index = i > 0 ? i - 1 : 0;
//                     const target = document.querySelector(`span[data-target-id="${toc[index].id}"]`);
//                     if (target) {
//                         target.classList.add('vditor-outline__item--current');
//                     }
//                     break;
//                 }
//             }
//         };
//
//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [toc]);
//
//     return (
//         <div style={{ display: 'flex' }}>
//             <div
//                 ref={previewRef}
//                 className="vditor"
//                 style={{
//                     maxHeight: maxHeight,
//                     overflowY: "scroll",
//                     padding: padding,
//                     maxWidth: 'calc(100vw *0.75)',
//                     border: "none",
//                     flex: 1,
//                 }}
//             />
//             <div
//                 ref={outlineRef}
//                 className="outline"
//                 style={{
//                     display: 'block',
//                     position: 'sticky',
//                     top: '20px',
//                     maxHeight: 'calc(100vh - 40px)',
//                     overflowY: 'auto',
//                     padding: '10px',
//                     width: '200px',
//                 }}
//             />
//         </div>
//     );
// };


import React, { useEffect, useRef, useState } from "react";
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
    padding = 0,
}) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);
    const [toc, setToc] = useState<Array<{ id: string; offsetTop: number }>>([]);

    useEffect(() => {
        if (previewRef.current) {
            Vditor.preview(previewRef.current, content, {
                // cdn: "",
                cdn: "https://unpkg.com/vditor@3.10.6",
                mode: "light",
                markdown: {
                    toc: true,
                },
                math: {
                    inlineDigit: true,
                    engine: "MathJax",
                },
                anchor: 1,
                after() {
                    if (outlineRef.current && previewRef.current) {
                        Vditor.outlineRender(previewRef.current, outlineRef.current);
                        initOutline();
                    }
                },
            });
        }
    }, [content]);

    const initOutline = () => {
        if (!previewRef.current || !outlineRef.current) return;

        const headingElements = Array.from(
            previewRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
        );

        const newToc = headingElements.map((item) => ({
            id: item.id,
            offsetTop: 0,
        }));

        setToc(newToc);

        // Add click event listeners to the outline items.
        outlineRef.current.querySelectorAll("span[data-target-id]").forEach((span) => {
            span.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent the default jump behavior
                event.stopPropagation();

                const targetId = (event.currentTarget as HTMLElement).getAttribute(
                    "data-target-id"
                );
                const targetElement = document.getElementById(targetId!);

                if (targetElement && previewRef.current) {
                    // Scroll the preview container to the target element
                    previewRef.current.scrollTo({
                        top: targetElement.offsetTop - 300,//scroll to the top of the target element (including title)
                        behavior: "smooth", // Smooth scrolling
                    });
                }
            });
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = previewRef.current?.scrollTop || 0;
            const currentElement = document.querySelector(
                ".vditor-outline__item--current"
            );

            for (let i = 0; i < toc.length; i++) {
                if (scrollTop < toc[i].offsetTop - 30) {
                    if (currentElement) {
                        currentElement.classList.remove("vditor-outline__item--current");
                    }
                    const index = i > 0 ? i - 1 : 0;
                    const target = document.querySelector(
                        `span[data-target-id="${toc[index].id}"]`
                    );
                    if (target) {
                        target.classList.add("vditor-outline__item--current");
                    }
                    break;
                }
            }
        };

        previewRef.current?.addEventListener("scroll", handleScroll);
        return () => previewRef.current?.removeEventListener("scroll", handleScroll);
    }, [toc]);

    return (
        <div style={{ display: "flex" }}>
            <div
                ref={previewRef}
                className="vditor"
                style={{
                    maxHeight: maxHeight,
                    overflowY: "scroll",
                    padding: padding,
                    maxWidth: "calc(100vw * 0.75)",
                    border: "none",
                    flex: 1,
                }}
            />
            <div
                ref={outlineRef}
                className="outline"
                style={{
                    display: "block",
                    position: "sticky",
                    top: "20px",
                    maxHeight: maxHeight,
                    overflowY: "auto",
                    padding: "10px",
                    width: "200px",
                    fontFamily: "Roboto"
                }}
            />
        </div>
    );
};
