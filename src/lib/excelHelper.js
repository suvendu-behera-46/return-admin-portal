// utils/excelHelper.js
import ExcelJS from "exceljs";

export async function createExcelFromProductIds(products) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Products");

  // Add column headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 15 },
    { header: "Shop ID", key: "shopId", width: 15 },
    { header: "Product ID", key: "productId", width: 15 },
    { header: "Name", key: "name", width: 30 },
    { header: "Handle", key: "handle", width: 20 },
    { header: "Variant ID", key: "variantId", width: 15 },
    { header: "Variant SKU", key: "variantSKU", width: 20 },
    { header: "Variant UPC", key: "variantUPC", width: 20 },
    { header: "Variant Option Value 1", key: "variantOptionValue1", width: 25 },
    { header: "Variant Option Value 2", key: "variantOptionValue2", width: 25 },
    { header: "Status", key: "status", width: 15 },
    {
      header: "Inventory Available Qty",
      key: "inventoryAvailableQty",
      width: 20,
    },
    { header: "Tag", key: "tag", width: 15 },
    { header: "Variant Price", key: "variantPrice", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Record Created At", key: "recordCreatedAt", width: 25 },
    { header: "Record Updated At", key: "recordUpdatedAt", width: 25 },
    { header: "Inventory Available", key: "inventoryAvailable", width: 20 },
    { header: "Vendor", key: "vendor", width: 20 },
    { header: "Image Source", key: "imgSrc", width: 30 },
    { header: "Exchange Only", key: "exchangeOnly", width: 15 },
    { header: "No Returns", key: "noReturns", width: 15 },
  ];

  // Add product data
  products.forEach((product) => {
    worksheet.addRow({ ...product, exchangeOnly: "", noReturns: "" });
  });

  // Create a buffer of the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
