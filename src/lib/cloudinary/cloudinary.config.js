"use server"
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'drgqzs3ws',
    api_key: '526934557442663',
    api_secret: 'z49xdx4zddC60lL_dwUt9AVuMsw'
});

export const uploadImage = async (formdata) => {
    const image = await formdata.get("image");

}