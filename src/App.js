import { useEffect, useState } from "react";
import Home from "./components/Home";
import Header from "./components/Header";
import Shop from "./components/Shop";
import uniqid from "uniqid";
import Cart from "./components/Cart";
import "@fortawesome/fontawesome-free/css/all.min.css";
import productsJson from "./products.json";
import RouteSwitch from "./RouteSwitch";
import ProductPage from "./components/ProductPage";

const App = () => {
  // Copy JSON to not modify directly
  let allProducts = JSON.parse(JSON.stringify(productsJson));

  // Require images to load properly
  allProducts.forEach((product) => {
    try {
      product.image = require(`${product.image}`);
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") {
        console.error("Image failed to load");
      } else console.error(error);
    }
  });

  // Will implement search products on this later
  const [products, setProducts] = useState(allProducts);
  const [cart, setCart] = useState([]);

  // Increments product quantity
  function addToCart(product, quantity) {
    setCart((prevCart) => {
      const productIndex = prevCart.findIndex((item) => item.id === product.id);
      // If product has not been added to cart before
      if (productIndex === -1) prevCart.push({ ...product, quantity });
      else prevCart[productIndex].quantity += quantity;

      return prevCart;
    });
  }

  function deleteFromCart(productId) {
    setCart((prevCart) =>
      prevCart.filter((product) => product.id !== productId)
    );
  }

  function onCartChange(productId, newQuantity) {
    if (newQuantity <= 0) {
      deleteFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) item.quantity = newQuantity;
        return item;
      })
    );
  }

  function decrementCartItem(product) {
    if (product.quantity === 1) {
      deleteFromCart(product.id);
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === product.id) item.quantity--;
        return item;
      })
    );
  }

  return (
    <RouteSwitch
      Header={() => <Header />}
      pages={[
        {
          element: <Home />,
          path: "/",
          id: uniqid(),
        },

        {
          element: <Shop products={products} />,
          path: "/shop",
          id: uniqid(),
        },

        {
          element: <Cart cart={cart} onChange={onCartChange} />,
          path: "/cart",
          id: uniqid(),
        },

        // Create route for all products
        ...allProducts.map((product) => ({
          element: (
            <ProductPage
              product={product}
              onAddToCart={addToCart}
              key={product.id}
            />
          ),

          path: `/shop/${product.path}`,
          id: uniqid(),
        })),
      ]}
    />
  );
};

export default App;
