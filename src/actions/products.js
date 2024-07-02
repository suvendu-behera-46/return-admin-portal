"use server";

import prisma from "@/server/prisma";

export async function getProductsByIds(productIds) {
  try {
    const products = prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
export async function getDistinctData(colName) {
  try {
    const query = {
      distinct: [colName],
      select: {
        [colName]: true, // Dynamic key based on the column name
      },
      take: 100,
    };

    const distinctData = await prisma.product.findMany(query);
    return distinctData.map((product) => product[colName]); // Dynamically access the column value
  } catch (error) {
    console.error(
      `Database query error: getDistinctData for column ${colName}`,
      error
    );
    throw new Error("Internal Server Error");
  }
}

// Function to get distinct variantIds
export async function getDistinctCoulmns(col) {
  try {
    const distinctVariantIds = await prisma.product.findMany({
      distinct: [col],
      select: {
        [col]: true,
      },
      take: 100,
    });
    return distinctVariantIds.map((product) => product.variantId);
  } catch (error) {
    console.error("Database query error:getDistinctVariantIds", error);
    throw new Error("Internal Server Error");
  }
}

// Function to get products by variantId
async function getProductsByVariantId(variantId) {
  try {
    const products = await prisma.product.findMany({
      where: {
        variantId: variantId,
      },
    });
    return products;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Internal Server Error");
  }
}

export async function getProducts(filters = {}) {
  try {
    // Destructure the filters for ease of use
    const { name, tag, status, vendor } = filters;

    // Build dynamic query filters
    const queryFilters = {};
    if (name) queryFilters.name = { contains: name, mode: "insensitive" }; // Case-insensitive name search
    if (tag) queryFilters.tag = tag;
    if (status) queryFilters.status = status;
    if (vendor) queryFilters.vendor = vendor;

    // Retrieve distinct variantIds that match the filters
    const distinctProductIds = await prisma.product.findMany({
      where: {
        ...queryFilters,
      },
      distinct: ["productId"],
      select: {
        productId: true,
      },
      take: 100,
    });
    const productIds = distinctProductIds.map((item) => item.productId);

    const productsByVariantId = [];

    for (const productId of productIds) {
      const products = await prisma.product.findMany({
        where: {
          productId: productId,
          ...queryFilters, // Apply filters to each variant fetch as well
        },
      });

      if (products.length > 0) {
        const productName = `${products[0].name} ${
          products[0].variantOptionValue1 || ""
        } / ${products[0].variantOptionValue2 || ""}`.trim();
        const variantImage = products[0].imgSrc;
        const prices = products.map((variant) => variant.variantPrice);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = `${minPrice} to ${maxPrice}`;

        productsByVariantId.push({
          productId: productId,
          productName,
          price: priceRange,
          variants: products,
          img: variantImage,
        });
      }
    }

    return productsByVariantId;
  } catch (error) {
    console.error("Error fetching and grouping Product with filters:", error);
    throw new Error("Internal Server Error");
  }
}

export async function getDistinctValues(column) {
  try {
    const distinctValues = await prisma.product.findMany({
      distinct: [column],
      select: {
        [column]: true,
      },
    });
    return distinctValues.map((row) => row[column]);
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Internal Server Error");
  }
}
// Debounce function to delay the search action

// Function to perform the product search by name
export async function searchProductsByName(name) {
  try {
    // Fetch all products matching the name, grouped by variantId
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case-insensitive search
        },
      },
      take: 100,
    });

    const productIds = products
      .map((p) => p.variantId)
      .filter((v, i, a) => a.indexOf(v) === i); // Unique variant IDs

    const productsByVariantId = [];

    for (const variantId of productIds) {
      const variants = products.filter((p) => p.variantId === variantId);
      if (variants.length > 0) {
        const variantName = `${variants[0].name} ${
          variants[0].variantOptionValue1 || ""
        } / ${variants[0].variantOptionValue2 || ""}`.trim();
        const variantImage = variants[0].imgSrc;
        const prices = variants.map((variant) => variant.variantPrice);
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const priceRange = `${minPrice} to ${maxPrice}`;

        productsByVariantId.push({
          variantId,
          variantName,
          price: priceRange,
          variants,
          img: variantImage,
        });
      }
    }

    return productsByVariantId;
  } catch (error) {
    console.error("Database search error:", error);
    throw new Error("Internal Server Error");
  }
}

export async function generatePricingArray(data) {
  try {
    // Fetch all products by productIds
    const products = await prisma.product.findMany({
      where: {
        variantId: { in: data.productIds },
      },
    });

    // Generate an array for the pricing table
    const pricingArray = products.map((product) => {
      let exchangeOnlyPrice, noReturnsPrice;

      // Check if the campaign type is PERCENTAGEOFF to handle percentages
      if (data.campaignType === "PERCENTAGEOFF") {
        exchangeOnlyPrice =
          product.variantPrice -
          (product.variantPrice * data.exchangeOnly) / 100;
        noReturnsPrice =
          product.variantPrice - (product.variantPrice * data.noReturns) / 100;
      } else {
        exchangeOnlyPrice = product.variantPrice - data.exchangeOnly;
        noReturnsPrice = product.variantPrice - data.noReturns;
      }

      return {
        variantId: product.variantId,
        merchantId: data.merchantId, // Ensure data contains merchantId
        exchangeOnlyPrice: exchangeOnlyPrice,
        noReturnsPrice: noReturnsPrice,
        easyReturnsPrice: product.variantPrice - data.clearance, // Assuming clearance is a flat discount
        allowForInternationalOrders: data.allowForInternationalOrder,
        eligible: true, // Set eligible as true, adjust as needed
        campaignId: data.id, // Include campaignId from data
        rank: data.rank, // Include rank if it's part of your data
      };
    });

    return pricingArray;
  } catch (error) {
    throw new Error(`Failed to generate pricing array: ${error.message}`);
  }
}

export async function getProductsGroupedByProductId(page = 1, pageSize = 10) {
  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Group products by productId
    const groupedProducts = products.reduce((acc, product) => {
      if (!acc[product.productId]) {
        acc[product.productId] = [];
      }
      acc[product.productId].push(product);
      return acc;
    }, {});

    // Transform grouped products into desired format
    const result = Object.keys(groupedProducts).map((productId) => {
      const productVariants = groupedProducts[productId];
      const productName = `${productVariants[0].name} ${
        productVariants[0].variantOptionValue1 || ""
      } / ${productVariants[0].variantOptionValue2 || ""}`.trim();
      const variantImage = productVariants[0].imgSrc;
      const prices = productVariants.map((variant) => variant.variantPrice);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const priceRange = `${minPrice} to ${maxPrice}`;

      return {
        productId: productId,
        productName,
        price: priceRange,
        variants: productVariants,
        img: variantImage,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching and grouping products by productId:", error);
    throw new Error("Internal Server Error");
  }
}
