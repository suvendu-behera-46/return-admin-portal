// "use server";
// import prisma from "@/server/prisma";

// // Create a new campaign
// async function createCampaign(data) {
//   try {
//     const campaign = await prisma.campaign.create({
//       data,
//     });
//     return campaign;
//   } catch (error) {
//     throw new Error(`Failed to create campaign: ${error.message}`);
//   }
// }

// // Read a single campaign by ID
// async function getCampaignById(id) {
//   try {
//     const campaign = await prisma.campaign.findUnique({
//       where: { id },
//     });
//     return campaign;
//   } catch (error) {
//     throw new Error(`Failed to retrieve campaign: ${error.message}`);
//   }
// }

// // Read all campaigns
// async function getAllCampaigns() {
//   try {
//     const campaigns = await prisma.campaign.findMany();
//     console.log("==============", campaigns);
//     return campaigns;
//   } catch (error) {
//     throw new Error(`Failed to retrieve campaigns: ${error.message}`);
//   }
// }

// // Update a campaign by ID
// async function updateCampaign(id, data) {
//   try {
//     const campaign = await prisma.campaign.update({
//       where: { id },
//       data,
//     });
//     return campaign;
//   } catch (error) {
//     throw new Error(`Failed to update campaign: ${error.message}`);
//   }
// }

// // Delete a campaign by ID
// async function deleteCampaign(id) {
//   try {
//     const campaign = await prisma.campaign.delete({
//       where: { id },
//     });
//     return campaign;
//   } catch (error) {
//     throw new Error(`Failed to delete campaign: ${error.message}`);
//   }
// }
// async function updateCampaignProducts(campaignId, productIds) {
//   try {
//     console.log(`Updating campaign ${campaignId} with products:`, productIds);

//     // Check if all provided product IDs exist
//     const existingProducts = await prisma.product.findMany({
//       where: {
//         variantId: { in: productIds }, // Ensure this uses the 'id' field if that's the identifier for products
//       },
//     });
//     const existingProductIds = existingProducts.map((p) => p.variantId);

//     // Compare provided IDs with existing IDs
//     const missingIds = productIds.filter(
//       (id) => !existingProductIds.includes(id)
//     );
//     if (missingIds.length > 0) {
//       throw new Error(`Product IDs not found: ${missingIds.join(", ")}`);
//     }

//     // Update the campaign with the new product IDs
//     const updatedCampaign = await prisma.campaign.update({
//       where: { id: campaignId },
//       data: {
//         productIds: productIds,
//       },
//     });

//     console.log(`Campaign updated successfully:`, updatedCampaign);
//     return updatedCampaign;
//   } catch (error) {
//     console.error(`Failed to update campaign: ${error.message}`);
//     throw new Error(`Failed to update campaign: ${error.message}`);
//   }
// }
// async function getCampaignsByNameAndId() {
//   try {
//     // Fetch the id and campaignName of the campaigns
//     const campaigns = await prisma.campaign.findMany({
//       select: {
//         id: true,
//         campaignName: true,
//       },
//     });

//     return campaigns;
//   } catch (error) {
//     console.error("Error fetching campaigns:", error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// export {
//   createCampaign,
//   getCampaignById,
//   getAllCampaigns,
//   updateCampaign,
//   deleteCampaign,
//   updateCampaignProducts,
//   getCampaignsByNameAndId,
// };

"use server";
import prisma from "@/server/prisma";

// Create a new campaign
async function createCampaign(data) {
  try {
    const campaign = await prisma.campaign.create({
      data: {
        campaignName: data.campaignName,
        rank: data.rank,
        allowForInternationalOrder: data.allowForInternationalOrder || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        budget: data.budget || null,
        continueCampaignOnPriceChange:
          data.continueCampaignOnPriceChange || null,
        campaignType: data.campaignType || null,
        status: data.status || "DRAFT",
        shopId: data.shopId || null,
        campaignProducts: data.products
          ? {
              create: data.products.map((product) => ({
                variantId: product.variantId,
                exchangeOnlyPrice: product.exchangeOnlyPrice,
                finalSalePrice: product.finalSalePrice,
                easyReturnsPrice: product.easyReturnsPrice,
              })),
            }
          : undefined,
      },
      include: {
        campaignProducts: {
          include: {
            product: true, // Include the related Product data
          },
        },
      },
    });
    return campaign;
  } catch (error) {
    throw new Error(`Failed to create campaign: ${error.message}`);
  }
}

// Read a single campaign by ID
async function getCampaignById(id) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        campaignProducts: true,
      },
    });
    return campaign;
  } catch (error) {
    throw new Error(`Failed to retrieve campaign: ${error.message}`);
  }
}

// Read all campaigns
async function getAllCampaigns() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        campaignProducts: {
          include: {
            product: true, // Include the related Product data
          },
        },
      },
    });
    console.log("==============", campaigns);
    return campaigns;
  } catch (error) {
    throw new Error(`Failed to retrieve campaigns: ${error.message}`);
  }
}

// Update a campaign by ID
async function updateCampaign(id, data) {
  console.log(data);
  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        campaignName: data.campaignName,
        rank: data.rank,
        allowForInternationalOrder: data.allowForInternationalOrder || false,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        budget: data.budget || null,
        continueCampaignOnPriceChange:
          data.continueCampaignOnPriceChange || false,
        campaignType: data.campaignType || null,
        status: data.status || "DRAFT",
        shopId: data.shopId || null,
        campaignProducts: data.products
          ? {
              deleteMany: {}, // Clear existing campaignProducts
              create: data.products.map((product) => ({
                variantId: product.variantId,
                exchangeOnlyPrice: product.exchangeOnlyPrice,
                finalSalePrice: product.finalSalePrice,
                easyReturnsPrice: product.easyReturnsPrice,
              })),
            }
          : undefined,
      },
      include: {
        campaignProducts: {
          include: {
            product: true, // Include the related Product data
          },
        },
      },
    });
    return campaign;
  } catch (error) {
    throw new Error(`Failed to update campaign: ${error.message}`);
  }
}

// Delete a campaign by ID
async function deleteCampaign(id) {
  try {
    const campaign = await prisma.campaign.delete({
      where: { id },
      include: {
        campaignProducts: true,
      },
    });
    return campaign;
  } catch (error) {
    throw new Error(`Failed to delete campaign: ${error.message}`);
  }
}

// Update campaign products
async function updateCampaignProducts(campaignId, productIds) {
  try {
    console.log(`Updating campaign ${campaignId} with products:`, productIds);

    // Check if all provided product variant IDs exist
    const existingProducts = await prisma.product.findMany({
      where: {
        variantId: { in: productIds }, // Ensure this uses the 'variantId' field
      },
    });
    const existingProductIds = existingProducts.map((p) => p.variantId);

    // Compare provided IDs with existing IDs
    const missingIds = productIds.filter(
      (id) => !existingProductIds.includes(id)
    );
    if (missingIds.length > 0) {
      throw new Error(`Product IDs not found: ${missingIds.join(", ")}`);
    }

    // Update the campaign with the new product variant IDs
    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        campaignProducts: {
          deleteMany: {}, // Clear existing campaignProducts
          create: productIds.map((variantId) => ({
            variantId: variantId, // Use variantId here
          })),
        },
      },
      include: {
        campaignProducts: {
          include: {
            product: true, // Include the related Product data
          },
        },
      },
    });

    console.log(`Campaign updated successfully:`, updatedCampaign);
    return updatedCampaign;
  } catch (error) {
    console.error(`Failed to update campaign: ${error.message}`);
    throw new Error(`Failed to update campaign: ${error.message}`);
  }
}

// Get campaigns by name and ID
async function getCampaignsByNameAndId() {
  try {
    // Fetch the id and campaignName of the campaigns
    const campaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        campaignName: true,
      },
    });

    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
async function updateCampaignStatus(id, status) {
  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        status: status,
      },
      include: {
        campaignProducts: {
          include: {
            product: true, // Include the related Product data
          },
        },
      },
    });
    return campaign;
  } catch (error) {
    throw new Error(`Failed to update campaign status: ${error.message}`);
  }
}

async function updatePricingTable(campaignDetails) {
  try {
    const {
      id,
      campaignName,
      rank,
      allowForInternationalOrder,
      startDate,
      endDate,
      budget,
      continueCampaignOnPriceChange,
      campaignType,
      status,
      shopId,
      campaignProducts,
    } = campaignDetails;

    for (const product of campaignProducts) {
      const existingPricing = await prisma.pricing.findFirst({
        where: { variantId: product.variantId },
      });

      if (existingPricing) {
        if (existingPricing.rank > rank) {
          return prisma.pricing
            .update({
              where: { id: existingPricing.id },
              data: {
                exchangeOnlyPrice: product.exchangeOnlyPrice,
                finalSalePrice: product.finalSalePrice,
                easyReturnsPrice: product.easyReturnsPrice,
                internationalShipping: allowForInternationalOrder,
                eligibilityFlag: true,
                rank: rank,
                campaignId: id,
              },
            })
            .then((e) => {
              return {
                success: true,
                message: "campaign updated ",
              };
            });
        } else {
          console.log("update later");

          return {
            success: true,
            message: "campaign is already runnign",
          };
        }
      } else {
        return prisma.pricing
          .create({
            data: {
              variantId: product.variantId,
              shopId: shopId,
              exchangeOnlyPrice: product.exchangeOnlyPrice,
              finalSalePrice: product.finalSalePrice,
              easyReturnsPrice: product.easyReturnsPrice,
              internationalShipping: allowForInternationalOrder,
              eligibilityFlag: true,
              rank: rank,
              campaignId: id,
            },
          })
          .then((e) => {
            console.log(e, "create");
            return {
              success: true,
              message: "campaign created ",
            };
          });
      }
    }
  } catch (error) {
    throw new Error(`Failed to update pricing table: ${error.message}`);
  }
}

export {
  createCampaign,
  getCampaignById,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
  updateCampaignProducts,
  getCampaignsByNameAndId,
  updateCampaignStatus,
  updatePricingTable,
};
