import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data));
  }, []);

  useEffect(() => console.log("products", products), [products]);

  return <div>Hey! Working with react</div>;
};

export default App;
