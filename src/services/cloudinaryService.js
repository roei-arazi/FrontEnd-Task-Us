
export const cloudinaryService = {
    uploadImg
}

async function uploadImg(ev) {
    const CLOUD_NAME = "dtg7n0zye"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData();
    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', 'Task-Us');
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        console.log(data);
        return data

    } catch (err) {
        console.log(err);
    }
}