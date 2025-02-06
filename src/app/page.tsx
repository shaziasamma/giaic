
"use client";
import React, { useEffect, useState } from "react";
import { client } from "../sanity/lib/client";
import { allProduct } from "../sanity/lib/quries";
import { Products } from "../../types/product";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { addToCart } from "./onClick/onClick";
import Swal from "sweetalert2";


const Page = () => {
  const [product, setProduct] = useState<Products[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      const fetchedProduct: Products[] = await client.fetch(allProduct);
      console.log(fetchedProduct); // Log fetched data for debugging
      setProduct(fetchedProduct);
    }
    fetchProduct();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Products) => {
    e.preventDefault();
    Swal.fire({
      position: "top-left",
      icon: "success",
      title: `${product.name} added to cart`,
      showConfirmButton: false,
      timer: 1000,
    });
    addToCart(product);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Latest New Arrivals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {product.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200"
          >
            <Link href={`/product/${product.slug?.current || "default-slug"}`}>
              {product.image ? (
                <Image
                  src={urlFor(product.image).url()}
                  alt="image"
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                  <span>No Image</span>
                </div>
              )}
              <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
              <p className="text-gray-500 mt-2">
                {product.price ? `$${product.price}` : "Price not available"}
              </p>
            </Link>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out mt-4"
              onClick={(e) => handleAddToCart(e, product)} 
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
