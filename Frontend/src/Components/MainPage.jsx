import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const products = [
  {
    id: 1,
    name: "Sun-Kissed Apricots",
    desc: "Sweet, chewy, and full of Vitamin A.",
    price: 349,
    img: "https://placehold.co/400x300/FCD34D/4D7C0F?text=Apricots",
  },
  {
    id: 2,
    name: "Tropical Mango Slices",
    desc: "A burst of tropical flavor in every bite.",
    price: 499,
    img: "https://placehold.co/400x300/FCD34D/4D7C0F?text=Dried+Mango",
  },
  {
    id: 3,
    name: "Forest Berry Mix",
    desc: "A tangy, sweet antioxidant powerhouse.",
    price: 650,
    img: "https://placehold.co/400x300/F87171/4D7C0F?text=Dried+Berries",
  },
  {
    id: 4,
    name: "Crunchy Almonds",
    desc: "Perfectly roasted for a healthy snack.",
    price: 399,
    img: "https://placehold.co/400x300/FFEDD5/4D7C0F?text=Almonds",
  },
  {
    id: 5,
    name: "Cashew Delight",
    desc: "Creamy cashews with a hint of salt.",
    price: 499,
    img: "https://placehold.co/400x300/D9F99D/4D7C0F?text=Cashews",
  },
  {
    id: 6,
    name: "Pistachio Crunch",
    desc: "Nutty and delicious pistachios.",
    price: 599,
    img: "https://placehold.co/400x300/DEF7FF/4D7C0F?text=Pistachios",
  },
  {
    id: 7,
    name: "Mixed Dry Fruits",
    desc: "A healthy mix of dried fruits.",
    price: 699,
    img: "https://placehold.co/400x300/FBCFE8/4D7C0F?text=Mixed+Fruits",
  },
  {
    id: 8,
    name: "Roasted Walnuts",
    desc: "Crunchy walnuts for your daily snack.",
    price: 550,
    img: "https://placehold.co/400x300/C7D2FE/4D7C0F?text=Walnuts",
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("user"); // Check login status
  const [title, setTitle] = useState("");

  // Typewriter animation effect
  useEffect(() => {
    const fullText = "Start Shopping... 🛒 🛍️";
    let i = 0;
    const timer = setInterval(() => {
      setTitle(fullText.substring(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      alert("Please login to add products to cart!");
    }
  };

  return (
    <div className="mainpage-container">
      <h2 className="typewriter">{title}</h2>

      <div className="products-grid">
        {products.map((product, index) => (
          <div
            className="product-card"
            key={product.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img src={product.img} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.desc}</p>
            <div className="product-bottom">
              <span>{product.price} ₹</span>
              <button
                className="btn-cart"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="back-home">
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
};

export default MainPage;
