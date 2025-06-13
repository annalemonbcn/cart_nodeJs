import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8080/api/products")
  //     .then((res) => setProducts(res.data));
  // }, []);

  // useEffect(() => console.log("products", products), [products]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8080/api/products");
      return res.data;
    },
  });

  console.log("data", data);

  return <div>Hey! Working with react</div>;
};

export default App;
