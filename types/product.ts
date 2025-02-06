export interface Products {
    quantity: number;
    inventory: number;
    _id: string; // Product ID
    name: string; // Product Name
    _type: "products"; // Document Type
    image?: {
      asset: {
        _ref: string; // Reference to the image asset
        _type: "image"; // Type of the asset
      };
    };
    price: number; // Product Price
    description?: string; // Optional Product Description
    slug: {
      _type: "slug"; // Slug Type
      current: string; // Slug Value
    };
    category?: string; // Optional Category
    discountPercent?: number; // Optional Discount Percentage
    new?: boolean; // Optional Flag for New Arrival
    colors?: string[]; // Optional Array of Colors
    sizes?: string[]; // Optional Array of Sizes
    inStock?: boolean; // Flag indicating if the product is in stock
  }
  
