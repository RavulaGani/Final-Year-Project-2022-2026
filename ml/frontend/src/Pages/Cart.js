import axios from "axios";
import React, { useEffect, useState } from "react";

const Cart = () => {
  const id = localStorage.getItem("id");
  const [cart, setCart] = useState([]);

  const getData = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/user/singleUser",
        { id: id }
      );

      if (data?.success) {
        setCart(data?.user?.cart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.post("http://localhost:8080/user/delete", {
        userID: id,
        itemID: itemId,
      });

      getData();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="max-w-4xl mx-auto">
        {cart.length === 0 ? (
          <p className="font-serif font-bold text-4xl text-gray-500 mt-20">
            Your cart is empty.
          </p>
        ) : (
          <>
            <h1 className="font-serif font-bold text-4xl">
              Total Item : {cart?.length}
            </h1>
            <div className="flex justify-center items-center flex-wrap gap-10 w-[900px] mt-20">
              {cart?.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden w-[270px] h-[470px]"
                >
                  <img
                    src={item?.itemImage}
                    alt={item.itemName}
                    className="w-full h-[300px] object-cover rounded-md mb-2"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {item.itemName}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.itemPrice}</p>
                    <button
                      onClick={() => handleRemoveFromCart(item?._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
