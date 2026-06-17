import { uploadImage }
from "../js/uploads.js";

const imageInput =
    document.getElementById("imageInput");

const uploadBtn =
    document.getElementById("uploadBtn");

const preview =
    document.getElementById("preview");

uploadBtn.addEventListener(
    "click",
    async () => {

        const file =
            imageInput.files[0];

        if (!file) {
            alert("Select image");
            return;
        }

        try {

            const url =
                await uploadImage(file);

            console.log(url);

            preview.src = url;

        }
        catch(err) {

            console.error(err);

            alert("Upload failed");
        }

    }
);