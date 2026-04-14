// src/FormPage.js
import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    skinTone: "",
    lipTone: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  const skinTones = [
    "#FFDDC1",
    "#FFE4E1",
    "#FFB6C1",
    "#FFC0CB",
    "#FFDAB9",
    "#FFEFD5",
    "#FFF8DC",
    "#FFFACD",
    "#FFFFE0",
    "#FFF5EE",
    "#E0A899",
    "#FFDAB9",
    "#F5DEB3",
    "#FFE4B5",
    "#FFEFD5",
    "#FFFACD",
    "#FFF5EE",
    "#FFF8DC",
    "#FAFAD2",
    "#FFE4C4",
    "#B16B8E",
    "#D8BFD8",
    "#DDA0DD",
    "#EE82EE",
    "#DA70D6",
    "#BA55D3",
    "#9932CC",
    "#8A2BE2",
    "#9400D3",
    "#8B008B",
  ];

  const lipTones = [
    "#E5D8BE",
    "#D3D3D3",
    "#C0C0C0",
    "#A9A9A9",
    "#808080",
    "#696969",
    "#778899",
    "#708090",
    "#2F4F4F",
    "#000000",
    "#FFE4E1",
    "#FFDAB9",
    "#FFB6C1",
    "#FFC0CB",
    "#FFDAB9",
    "#FFEFD5",
    "#FFF8DC",
    "#FFFACD",
    "#FFFFE0",
    "#FFF5EE",
    "#D6A4A4",
    "#F5DEB3",
    "#FFDAB9",
    "#FFE4B5",
    "#FFEFD5",
    "#FFFACD",
    "#FFF5EE",
    "#FFF8DC",
    "#FAFAD2",
    "#FFE4C4",
    "#A39391",
    "#8B5E83",
    "#63474D",
    "#3D3035",
    "#A52A2A",
    "#8B0000",
  ];

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Beauty Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="skinTone" className="block text-gray-700">
              Skin Tone
            </label>
            <select
              id="skinTone"
              name="skinTone"
              value={formData.skinTone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your skin tone</option>
              {skinTones.map((tone, index) => (
                <option
                  key={index}
                  value={tone}
                  style={{ backgroundColor: tone }}
                >
                  {tone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lipTone" className="block text-gray-700">
              Lip Tone
            </label>
            <select
              id="lipTone"
              name="lipTone"
              value={formData.lipTone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your lip tone</option>
              {lipTones.map((tone, index) => (
                <option
                  key={index}
                  value={tone}
                  style={{ backgroundColor: tone }}
                >
                  {tone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="gender" className="block text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
