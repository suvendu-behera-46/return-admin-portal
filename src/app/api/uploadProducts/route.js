// src/app/api/uploadProducts/route.js
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.getWorksheet("Products");

    const products = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const [
        id,
        shopId,
        productId,
        name,
        handle,
        variantId,
        variantSKU,
        variantUPC,
        variantOptionValue1,
        variantOptionValue2,
        status,
        inventoryAvailableQty,
        tag,
        variantPrice,
        category,
        recordCreatedAt,
        recordUpdatedAt,
        inventoryAvailable,
        vendor,
        imgSrc,
        exchangeOnly,
        noReturns,
      ] = row.values.slice(1); // Slice to skip first empty cell

      products.push({
        id,
        shopId,
        productId,
        name,
        handle,
        variantId,
        variantSKU,
        variantUPC,
        variantOptionValue1,
        variantOptionValue2,
        status,
        inventoryAvailableQty,
        tag,
        variantPrice,
        category,
        recordCreatedAt: new Date(recordCreatedAt),
        recordUpdatedAt: new Date(recordUpdatedAt),
        inventoryAvailable,
        vendor,
        imgSrc,
        exchangeOnly: parseFloat(exchangeOnly),
        noReturns: parseFloat(noReturns),
      });
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Failed to process the file: ${error.message}` },
      { status: 500 }
    );
  }
}
