import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import axiosInstance from "../../utils/AxiosInstance.ts";
import { FUser } from "../../entity/FUser.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";

interface CustomEditorProps {
    height?: number;
    maxWidth?: number | string;
    placeholder?: string;
}

export interface CustomEditorRef {
    getValue: () => string | undefined;
    setValue: (value: string) => Promise<void>;
}

export const MdEditor = forwardRef<CustomEditorRef, CustomEditorProps>(
    (
        {
            height = window.innerHeight * 0.7,
            maxWidth = "100%",
            placeholder = "# Title 标题 \nStart writing **here**! 从**这里**开始撰写你的文章吧！\n You can use $\\LaTeX$ formula here: $\\frac{1}{2}$",
        },
        ref
    ) => {
        const [vd, setVd] = useState<Vditor>();
        const vdRef = useRef<Vditor | null>(null);


        useImperativeHandle(ref, () => ({
            getValue: () => vdRef.current?.getValue(),
            setValue: async (value: string) => {
                if (!vdRef.current) {
                    await waitForVditor();
                }
                vdRef.current?.setValue(value);
            },
        }));

        const waitForVditor = () => {
            return new Promise<void>((resolve) => {
                const checkVd = () => {
                    if (vdRef.current) {
                        resolve();
                    } else {
                        requestAnimationFrame(checkVd);
                    }
                };
                checkVd();
            });
        };

        // useImperativeHandle(ref, () => ({
        //     getValue: () => vdRef.current?.getValue(),
        //     setValue: async (value: string) => {
        //         if (!vdRef.current) {
        //             // wait for Vditor to initialize
        //             await new Promise<void>((resolve) => {
        //                 const checkVd = () => {
        //                     if (vdRef.current) {
        //                         console.log("Vditor instance created");
        //                         resolve();
        //                     } else {
        //                         setTimeout(checkVd, 100);
        //                     }
        //                 };
        //                 checkVd();
        //             });
        //         }
        //         vdRef.current?.setValue(value);
        //     },
        // }));

        const handleImageUpload = (
            file: File,
            callback: (path: string) => void
        ) => {
            const formData = new FormData();
            if (!file) {
                return;
            }
            formData.append("image", file);
            formData.append(
                "authorId",
                (
                    JSON.parse(
                        localStorage.getItem("userInfo") as string
                    ) as FUser
                ).userId.toString()
            );
            axiosInstance
                .post("/forum/image/upload", formData)
                .then((res: AxiosResponse<APIResponse<string>>) => {
                    if (res.data.code == ResponseCodes.SUCCESS) {
                        callback(res.data.data);
                    } else {
                        console.error(
                            "Upload image failed: " + res.data.message
                        );
                    }
                })
                .catch((err) => {
                    console.error("Upload image failed: " + err);
                });
        };

        // create vditor
        useEffect(() => {
            const vditor = new Vditor("vditor", {
                height: height,
                width: maxWidth,
                counter: {
                    enable: true,
                    type: "markdown",
                },
                cache: {
                    enable: false,
                },
                placeholder,
                outline: {
                    enable: true,
                    position: "left",
                },
                mode: "ir",
                comment: {
                    enable: false,
                },
                preview: {
                    math: {
                        inlineDigit: true,
                        engine: "MathJax",
                    },
                },
                cdn: "https://cdn.jsdelivr.net/npm/vditor@3.10.6",
                upload: {
                    accept: "image/*",
                    multiple: false,
                    headers: { token: localStorage.getItem("token") ?? "" },
                    filename(name) {
                        return name
                            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
                            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
                            .replace("/\\s/g", "");
                    },
                    handler(file) {
                        const callback = (path: string) => {
                            const name = file[0] && file[0].name;
                            let succFileText = "";
                            if (
                                vditor &&
                                vditor.vditor.currentMode === "wysiwyg"
                            ) {
                                succFileText += `\n <img alt=${name} src="${path}">`;
                            } else {
                                succFileText += `  \n![${name}](${path})`;
                            }
                            vditor.insertValue(succFileText);
                            succFileText;
                        };
                        handleImageUpload(file[0], callback);
                        return null;
                    },
                },
                after: () => {
                    setVd(vditor);
                    vdRef.current = vditor;
                },
            });

            return () => {
                vd?.destroy();
                setVd(undefined);
            };
        }, [height, maxWidth, placeholder]);

        return <div id="vditor" className="vditor" />;
    }
);
