import React, { useEffect, useState } from "react";

export default function ListOfProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      let response = await fetch("http://onlineshopping.com/products", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsbGVuQGFsbGVuLmNvbSIsIm5hbWUiOiJBbGxlbiIsImlhdCI6MTY3NzIyOTM3MywiZXhwIjoxNjc3NDAyMTczfQ.BPluW8WCS1lwxThTuGlghNELZm7rdn2hPwnVQdiwhwk",
        },
      });
      let productList = await response.json();
      setProducts(productList);
    })();
  }, []);

  return (
    <div>
      <ul>
        {products?.map(p => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
