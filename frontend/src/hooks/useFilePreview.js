import { useEffect, useMemo, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

export default function useFilePreview(file) {
    const [previewSrc, setPreviewSrc] = useState(null);

    // create preview url
    useEffect(() => {
        if (!file) {
            setPreviewSrc(null);
            return;
        }

        // File object (new upload)
        if (file instanceof File) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewSrc(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }

        // Existing file path from backend
        if (typeof file === "string") {
            setPreviewSrc(`${BASE_URL}${file}`);
        }
    }, [file]);

    // safe filename extraction
    const fileName = useMemo(() => {
        if (!file) return "";

        if (file instanceof File) return file.name;

        if (typeof file === "string")
            return file.split("/").pop();

        return "";
    }, [file]);

    return {
        previewSrc,
        fileName,
        hasFile: !!file
    };
}