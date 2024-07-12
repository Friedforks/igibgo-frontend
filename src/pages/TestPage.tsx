import React, { useRef, useState } from "react";

export const TestPage: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [blobs, setBlobs] = useState<Blob[]>([]);

    const handleVideoUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            const url = URL.createObjectURL(file);
            if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.onloadeddata = async () => {
                    await captureFrames();
                };
            }
        }
    };

    const captureFrames = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            if (!context) return;

            const duration = video.duration;
            // capture frames at 0%, 20%, 40%, 60%, 80%, and 100% of the video duration
            const timePoints = [0, 0.2, 0.4, 0.6, 0.8, 1].map(
                (p) => p * duration,
            );
            // save the blobs and image URLs for the captured frames
            const blobs: Blob[] = [];
            const imageUrls: string[] = [];

            // capture frames at the specified time points
            for (const timePoint of timePoints) {
                video.currentTime = timePoint;
                await new Promise<void>((resolve) => {
                    video.onseeked = () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        context.drawImage(
                            video,
                            0,
                            0,
                            video.videoWidth,
                            video.videoHeight,
                        );
                        canvas.toBlob((blob: Blob | null) => {
                            if (blob) {
                                blobs.push(blob);
                                imageUrls.push(URL.createObjectURL(blob));
                            }
                            resolve();
                        }, "image/jpeg");
                    };
                });
            }

            setBlobs(blobs);
            setImageURLs(imageUrls);
        }
    };

    const uploadBlobs = async () => {
        const formData = new FormData();
        blobs.forEach((blob, index) => {
            formData.append(`image${index}`, blob, `capture-${index}.jpg`);
        });

        try {
            const response = await fetch("YOUR_SERVER_ENDPOINT", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Images uploaded successfully");
            } else {
                console.error("Images upload failed");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    return (
        <div>
            <label>
                Upload Video
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                />
            </label>
            <video ref={videoRef} style={{ display: "none" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {imageURLs.length > 0 && (
                <div>
                    <h3>Captured Frames:</h3>
                    {imageURLs.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Captured frame ${index}`}
                            height={300}
                        />
                    ))}
                </div>
            )}
            {blobs.length > 0 && (
                <button onClick={uploadBlobs}>Upload Captured Frames</button>
            )}
        </div>
    );
};
