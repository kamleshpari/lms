import {v2 as cloudinary} from 'cloudinary'


const connectCloudinary=async()=>{
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        cloud_key:process.env.CLOUDINARY_API_KEY,
        cloud_secret_key:process.env.CLOUDINARY_SECRET_KEY,
    })
}

export default connectCloudinary