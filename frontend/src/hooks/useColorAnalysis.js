import { useState } from "react";
import axios from "axios";
// Clothes.json has male data with category field (better for filtering)
// Data.json has both male & female - used for female lookups
import clothesData from "../Clothes.json";
import allData     from "../Data.json";
import { useToast }  from "../context/ToastContext";
import { useAuth }   from "../context/AuthContext";

const API_PYTHON = "http://127.0.0.1:8000";
const API_JAVA   = "http://localhost:8080";

export const useColorAnalysis = () => {
  const toast    = useToast();
  const { userId } = useAuth();

  const [clothes,              setClothes]              = useState([]);
  const [colorRecommendations, setColorRecommendations] = useState([]);
  const [skin,                 setSkin]                 = useState("");
  const [eye,                  setEye]                  = useState("");
  const [loading,              setLoading]              = useState(false);
  const [filter,               setFilter]               = useState("all");
  const [showColors,           setShowColors]           = useState(false);
  const [analysed,             setAnalysed]             = useState(false);

  const findClothes = (colorRecs, gender) => {
    // Use Clothes.json for male (has category field), Data.json for female
    const dataset = gender === "male" ? clothesData : allData;
    const genderData = dataset.find((d) => d.gender === gender);
    if (!genderData?.colors) return [];

    const normalized = colorRecs.map((c) =>
      c.startsWith("#") ? c.toLowerCase() : `#${c.toLowerCase()}`
    );

    const result = [];
    genderData.colors.forEach((colorObj) => {
      const val = (colorObj.value || colorObj.hex || "").toLowerCase();
      if (!val || !Array.isArray(colorObj.clothes)) return;
      if (normalized.includes(val)) result.push(...colorObj.clothes);
    });
    return result;
  };

  const runAnalysis = async (formData, gender) => {
    if (!gender) {
      toast.warning("Please select your gender first.");
      return false;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_PYTHON}/upload_image`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      const { response_skin, response_eye, color_recommendations } = data;
      setColorRecommendations(color_recommendations || []);
      setSkin(response_skin?.result?.season || "");
      setEye(response_eye?.result?.result   || "");
      const found = findClothes(color_recommendations || [], gender);
      setClothes(found);
      setFilter("all");
      setAnalysed(true);
      if (!found.length) toast.info("No matching clothes found for your palette. Try a different photo.");
      else toast.success(`Analysis complete! Found ${found.length} outfit matches.`);
      return true;
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error("Analysis failed. Please check your connection and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addToFavourite = async (item) => {
    if (!userId) { toast.error("Please log in to save favourites."); return; }
    try {
      const { data } = await axios.post(`${API_JAVA}/user/addFavItem`, {
        itemName:  item.name,
        itemImage: item.image,
        itemPrice: item.price || 0,
        id:        userId,
      });
      if (data?.success) toast.success("Added to favourites! ❤️");
      else toast.error(data?.message || "Could not add to favourites.");
    } catch (err) {
      toast.error("Error saving favourite. Please try again.");
    }
  };

  const filteredClothes = clothes.filter((item) => {
    if (filter === "all") return true;
    return (item.category || "").toLowerCase() === filter;
  });

  const reset = () => {
    setClothes([]); setColorRecommendations([]); setSkin(""); setEye("");
    setLoading(false); setFilter("all"); setShowColors(false); setAnalysed(false);
  };

  return {
    clothes, filteredClothes, colorRecommendations,
    skin, eye, loading, filter, setFilter,
    showColors, setShowColors, analysed,
    runAnalysis, addToFavourite, reset,
  };
};
