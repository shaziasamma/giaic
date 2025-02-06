
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Products } from "../../../../types/product";


interface ProductPageProps {
  params: { slug: string };
}

// Fetch product data based on slug
async function getProduct(slug: string): Promise<Products | null> {
  try {
    const product = await client.fetch<Products>(
      groq`*[_type == "products" && slug.current == $slug][0]{
        _id,
        name,
        _type,
        image,
        price,
        description,
        slug,
        category,
        discountPercent,
        new,
        colors,
        sizes
      }`,
      { slug }
    );

    return product || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = await getProduct(slug);

  // Handle case where product is not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-semibold text-center text-red-600">
          Product Not Found
        </h1>
      </div>
    );
  }

  // Calculate discount price
  const discountedPrice = product.discountPercent
    ? product.price - (product.price * product.discountPercent) / 100
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
          {product.image ? (
            <Image
              src={urlFor(product.image).url()}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          {/* Product Name and New Tag */}
          <h1 className="text-3xl font-semibold mb-4">
            {product.name}
            {product.new && (
              <span className="ml-3 text-sm text-green-600 font-medium">
                New!
              </span>
            )}
          </h1>

          {/* Price and Discounted Price */}
          <p className="text-xl text-gray-700 mb-4">
            {discountedPrice ? (
              <>
                <span className="line-through text-gray-500">
                  ${product.price.toFixed(2)}
                </span>{" "}
                <span className="text-red-600">
                  ${discountedPrice.toFixed(2)}
                </span>
              </>
            ) : (
              `$${product.price.toFixed(2)}`
            )}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 mb-6">{product.description}</p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Available Colors:</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Available Sizes:</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <h3 className="text-lg font-semibold">Category:</h3>
            <span className="text-gray-700">{product.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
