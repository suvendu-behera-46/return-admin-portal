// PricingActions.js
"use server";
import prisma from "@/server/prisma"; // Ensure the correct path to your Prisma client

// Create a new pricing record
async function createPricing(data) {
  try {
    const pricing = await prisma.pricing.create({
      data,
    });
    return pricing;
  } catch (error) {
    throw new Error(`Failed to create pricing: ${error.message}`);
  }
}

// Retrieve a single pricing record by ID
async function getPricingById(id) {
  try {
    const pricing = await prisma.pricing.findUnique({
      where: { id },
    });
    return pricing;
  } catch (error) {
    throw new Error(`Failed to retrieve pricing: ${error.message}`);
  }
}

// Retrieve all pricing records
async function getAllPricings() {
  try {
    const pricings = await prisma.pricing.findMany();
    return pricings;
  } catch (error) {
    throw new Error(`Failed to retrieve pricings: ${error.message}`);
  }
}

// Update a pricing record by ID
async function updatePricing(id, data) {
  try {
    const pricing = await prisma.pricing.update({
      where: { id },
      data,
    });
    return pricing;
  } catch (error) {
    throw new Error(`Failed to update pricing: ${error.message}`);
  }
}

// Delete a pricing record by ID
async function deletePricing(id) {
  try {
    const pricing = await prisma.pricing.delete({
      where: { id },
    });
    return pricing;
  } catch (error) {
    throw new Error(`Failed to delete pricing: ${error.message}`);
  }
}

async function createManyPricings(dataArray) {
  try {
    const pricings = await prisma.pricing.createMany({
      data: dataArray,
    });
    return pricings;
  } catch (error) {
    throw new Error(`Failed to create multiple pricings: ${error.message}`);
  }
}

// Export all functions for use elsewhere in the application
export {
  createPricing,
  getPricingById,
  getAllPricings,
  updatePricing,
  deletePricing,
  createManyPricings,
};
