import { supabaseClient } from "./supabase.js";

//compression
async function compressImage(file) {

    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true
    };

    return await imageCompression(
        file,
        options
    );
}

export async function uploadImage(file) {

    let fileToUpload = file;

    // Only compress images
    if (file.type.startsWith("image/")) {

        fileToUpload =
            await compressImage(file);

        console.log(
            "Original:",
            (file.size / 1024 / 1024).toFixed(2),
            "MB"
        );

        console.log(
            "Compressed:",
            (
                fileToUpload.size /
                1024 /
                1024
            ).toFixed(2),
            "MB"
        );
    }

    const fileName =
        `${Date.now()}-${file.name}`;

    const { error } =
        await supabaseClient.storage
            .from("uploads")
            .upload(
                fileName,
                fileToUpload
            );
            console.log("File uploaded:", fileName);
    if (error) throw error;

    const { data } =
        supabaseClient.storage
            .from("uploads")
            .getPublicUrl(fileName);
    console.log("Public URL data:", data);
    return data.publicUrl;
}