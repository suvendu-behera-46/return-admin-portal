// pages/api/exportProducts.js
"use server";
import prisma from "@/server/prisma"; // Ensure the correct path to your Prisma client
import { createExcelFromProductIds } from "@/lib/excelHelper"; // Ensure the correct path to your helper function

export async function downloadProducts(productIds) {
  try {
    // Retrieve product data from the database based on the given product IDs
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        variantPrice: true,
      },
    });

    // Create Excel file from the product data
    const excelFileBuffer = await createExcelFromProductIds(products);

    // Return the Excel file as a response
    return new Response(excelFileBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="products.xlsx"',
      },
    });
  } catch (error) {
    return new Response(`Failed to export products: ${error.message}`, {
      status: 500,
    });
  }
}
