import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Upload from "./Pages/Upload";
import Form from "./Pages/Form";
import Cart from "./Pages/Cart";
import Camera from "./Pages/Camera";
import Favourite from "./Pages/Favourite";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/form" element={<Form />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/favourite" element={<Favourite />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
