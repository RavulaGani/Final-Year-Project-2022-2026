// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 ">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
          <p className="text-sm mb-2">
            Have any questions or feedback? Reach out to us!
          </p>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:support@gmail.com"
              className="text-blue-400 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm">
            &copy; 2024 COLOR INSIGHT All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
