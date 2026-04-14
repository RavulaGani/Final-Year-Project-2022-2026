import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const user = localStorage.getItem("user");
  const items = [
    {
      color: "bg-red-500",
      title: "Red",
      description:
        "Red is the color of fire and blood, symbolizing strong emotions such as passion, love, and anger. It is a vibrant and intense color that grabs attention and signifies danger, strength, and power. Red is often used in marketing to create excitement and urgency, making it a popular choice for sales and clearance events. It stimulates faster heartbeat and breathing, and can also enhance metabolism.",
      image:
        "https://media.istockphoto.com/id/494120857/photo/wardrobe-with-red-clothes-hanging-on-a-rack-nicely-arranged.jpg?s=612x612&w=0&k=20&c=ZdU1UMr18yGKT-KStg5M2-lOh8nEZ2gHiZhp873yHsA=",
    },
    {
      color: "bg-blue-500",
      title: "Blue",
      description:
        "Blue is the color of the sky and the sea, often associated with depth, stability, and tranquility. It is known for its calming effects, promoting a sense of peace and relaxation. Blue is linked to trust, loyalty, wisdom, confidence, and intelligence. It is a preferred color in corporate branding because it conveys professionalism and reliability. However, too much blue can evoke feelings of sadness and aloofness.",
      image:
        "https://i.pinimg.com/originals/62/39/42/623942eaf6ee252820a4f18216f02959.jpg",
    },
    {
      color: "bg-green-500",
      title: "Green",
      description:
        "Green is the color of nature, symbolizing growth, harmony, freshness, and fertility. It is a soothing color that promotes relaxation and restfulness, often associated with health, healing, and tranquility. Green represents balance and is often used in designs to indicate safety and eco-friendliness. It is also a color of prosperity and wealth, often associated with money and finance.",
      image:
        "https://img.freepik.com/premium-photo/stylish-green-closet_1017677-2663.jpg",
    },
    {
      color: "bg-yellow-500",
      title: "Yellow",
      description:
        "Yellow is the color of sunshine, radiating warmth, joy, and energy. It is an uplifting and cheerful color that stimulates mental activity and generates muscle energy. Yellow is often associated with happiness, positivity, and intellect. It can be used to draw attention and create a sense of urgency, similar to red. However, too much yellow can cause anxiety and agitation.",
      image:
        "https://beautywithlily.com/wp-content/uploads/2019/08/yellowww.jpg",
    },
    {
      color: "bg-purple-500",
      title: "Purple",
      description:
        "Purple combines the stability of blue and the energy of red, representing royalty, luxury, power, and ambition. It is often associated with wealth, extravagance, and creativity. Purple is a mysterious color that is also linked to spirituality and wisdom. It encourages imaginative and creative thinking, making it a popular choice in artistic and innovative designs. However, excessive use of purple can evoke feelings of frustration and arrogance.",
      image:
        "https://img.freepik.com/premium-photo/closet-with-purple-shirts-purple-shirts-purple-one-that-says-other_854727-84457.jpg",
    },
  ];

  const carouselItems = items.map((item, index) => (
    <div
      key={index}
      className={`flex  items-center justify-center ${item.color} w-screen h-[800px] text-white p-4  gap-10`}
    >
      <img className="rounded-xl h-[600px] w-[600px]" src={item.image} />
      <div className="flex flex-col justify-center items-start">
        <h2 className="text-4xl mb-4 font-bold">{item.title}</h2>
        <p className="text-2xl">{item.description}</p>
      </div>
    </div>
  ));

  const sections = [
    {
      title: "How It Works?",
      description:
        "Using cutting-edge image processing techniques, our machine learning algorithm identifies the dominant colors in your uploaded images. Based on the detected colors, we then recommend a selection of clothing items that complement the identified hues.",
    },
    {
      title: "Why Use Our Service?",
      description:
        "Whether you're looking to match your outfit to your favorite photo or seeking fashion inspiration based on specific colors, our platform offers a seamless and enjoyable experience. Discover new clothing styles that resonate with the colors you love, and elevate your fashion game effortlessly.",
    },
    {
      title: "Our Mission?",
      description:
        "Our mission is to blend technology with fashion, providing users with unique and personalized style recommendations. We strive to make fashion more accessible and enjoyable through the power of artificial intelligence.",
    },
  ];
  return (
    <>
      <div className="bg-[url('https://www.hdwallpapers.in/download/color_paint_stains_abstract_wallpaper_capturing_spontaneous_beauty_of_paint_splatters_and_stains_on_digital_canvas_vibrant_colors_hd_abstract-HD.jpg')] bg-cover h-screen flex flex-col p-4">
        <div className="bg-blue-400 rounded-full "></div>
        <h1 className="text-[100px] font-serif font-bold mt-40 place-self-center">
          COLOR INSIGHT
        </h1>

        <h1 className="text-[50px] font-serif font-bold mt-20 place-self-center">
          What's your Color?
        </h1>
      </div>

      <div className="relative w-full bg-gray-100">
        <AliceCarousel
          mouseTracking
          infinite
          items={carouselItems}
          responsive={{
            1024: { items: 1 },
          }}
          controlsStrategy="alternate"
          disableDotsControls
          renderPrevButton={() => (
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10">
              <FaChevronLeft />
            </button>
          )}
          renderNextButton={() => (
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full z-10">
              <FaChevronRight />
            </button>
          )}
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100 text-gray-800">
        <h1 className="text-5xl font-bold mb-8 text-center animate-bounce">
          About Our Website
        </h1>
        <div className="flex flex-wrap justify-center gap-14 mt-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full md:w-1/3 hover:scale-105 cursor-pointer opacity-70 hover:opacity-100 hover:bg-slate-100"
            >
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <p className="text-lg">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
