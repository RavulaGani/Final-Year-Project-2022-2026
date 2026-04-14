import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import data1 from "../Data.json";
import { CiShoppingCart } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
const Camera = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clothes, setClothes] = useState([]);
  const [gender, setGender] = useState("");
  const [colorRecommendations, setColorRecommendations] = useState([]);
  const id = localStorage.getItem("id");
  const [skin, setSkin] = useState("");
  const [lip, setLip] = useState("");
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", dataURLtoFile(imageSrc, "image.png"));
    try {
      const response = await fetch("http://127.0.0.1:8000/upload_image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const { response_image, response_lip, color_recommendations } = data;
        console.log(data);
        const lipToneMapping = {
          1: "spring",
          2: "summer",
          3: "autumn",
          4: "winter",
        };
        const lipTone = lipToneMapping[response_lip.result.result] || "unknown";

        setColorRecommendations(color_recommendations);
        setSkin(response_image?.result?.season);
        setLip(response_lip?.result?.result);
        handleClothes(color_recommendations);

        setLoading(false);
      } else {
        console.error("Error:", JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("Upload error:", error.message);
    }
  };
  const handleCartClick = async (item) => {
    try {
      const { data } = await axios.post("http://localhost:8080/user/addItem", {
        itemName: item?.name,
        itemPrice: item?.price,
        itemImage: item?.image,
        id: id,
      });
      if (data?.success) {
        alert("Item added successfully");
      }
      console.log("Item added:", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlefavClick = async (item) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/user/addFavItem",
        {
          itemName: item?.name,
          itemPrice: item?.price,
          itemImage: item?.image,
          id: id,
        }
      );
      if (data?.success) {
        alert("Item added to favourite successfully");
      }
      console.log("Item added:", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClothes = (color_recommendations) => {
    if (gender) {
      console.log(color_recommendations);
      const filteredClothes = [];
      const genderData = data1.find((d) => d.gender === gender);
      if (genderData) {
        genderData.colors.forEach((colorObj) => {
          if (color_recommendations.includes(colorObj.value)) {
            filteredClothes.push(...colorObj.clothes);
          }
        });
      }

      setClothes(filteredClothes);
    }
  };
  const dataURLtoFile = (dataurl, filename) => {
    const [header, data] = dataurl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const bstr = atob(data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center gap-10 ">
      <div className="p-4 flex  justify-center items-center gap-10">
        <div className="flex flex-col justify-center items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            className="mb-4"
          />

          <button
            onClick={capture}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Capture
          </button>
        </div>
        <div className="flex justify-center items-center flex-col">
          {imageSrc && (
            <>
              <img src={imageSrc} alt="Captured" className="mb-4" />

              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
              <select
                className="font-serif font-semibold cursor-pointer p-4 rounded-xl mt-5 outline-none bg-slate-200"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mt-10">
        <div className="flex justify-center items-center gap-10">
          {skin ? <h1 className="font-bold text-xl">Skin Tone: {skin}</h1> : ""}
          {lip ? <h1 className="font-bold text-xl">Lip Tone: {lip}</h1> : ""}
        </div>

        <div className="flex justify-center items-center gap-10 w-[400px] flex-wrap mt-5 ">
          {colorRecommendations?.map((color) => (
            <div
              key={color}
              className="rounded-full h-10 w-10"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
      {clothes?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Recommended Clothes</h2>
          <div className="flex justify-center items-center gap-10 w-[900px] flex-wrap">
            {clothes?.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-md h-[400px] w-[400px]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[250px] w-full mb-2"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.price}</p>
                <button
                  onClick={() => handleCartClick(item)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <CiShoppingCart />
                </button>
                <button
                  onClick={() => handlefavClick(item)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <FaRegHeart />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
