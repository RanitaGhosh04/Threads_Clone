import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
            // console.log(reader);
            

			reader.onloadend = () => {
                // contains the Base64-encoded data URL of the image.
				setImgUrl(reader.result);
			};

            // readAsDataURL(file) is essential for converting image files into a format suitable for previewing in web applications
			reader.readAsDataURL(file);
		} else {
			showToast("Invalid file type", " Please select an image file", "error");
			setImgUrl(null);
		}
	};
    
    // console.log(imgUrl);
    
	return { handleImageChange, imgUrl,setImgUrl };
};

export default usePreviewImg;