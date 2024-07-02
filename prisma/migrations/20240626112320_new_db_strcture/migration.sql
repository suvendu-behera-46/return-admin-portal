-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'LIVE', 'PAUSED', 'COMPLETE');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('AMOUNTOFF', 'PERCENTAGEOFF', 'UPLOAD', 'AUTOMATIC');

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "shopUserID" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Invite Sent',
    "shopID" INTEGER NOT NULL,
    "dateTimeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoggedInDateTime" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "variantSKU" TEXT NOT NULL,
    "variantUPC" TEXT NOT NULL,
    "variantOptionValue1" TEXT NOT NULL,
    "variantOptionValue2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inventoryAvailableQty" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "variantPrice" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "recordCreatedAt" TIMESTAMP(3) NOT NULL,
    "recordUpdatedAt" TIMESTAMP(3) NOT NULL,
    "inventoryAvailable" INTEGER NOT NULL,
    "vendor" TEXT NOT NULL,
    "imgSrc" TEXT NOT NULL,
    "productType" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "campaignName" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "allowForInternationalOrder" BOOLEAN,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "continueCampaignOnPriceChange" BOOLEAN,
    "campaignType" "CampaignType",
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "shopId" INTEGER,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignProduct" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "exchangeOnlyPrice" DOUBLE PRECISION,
    "finalSalePrice" DOUBLE PRECISION,
    "easyReturnsPrice" DOUBLE PRECISION,

    CONSTRAINT "CampaignProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "Order ID" TEXT,
    "Order Name" TEXT,
    "Created Date" TIMESTAMP(3),
    "Payment Status" TEXT,
    "Fulfilment Status" TEXT,
    "Line Item" TEXT,
    "Qty" INTEGER,
    "Price" DOUBLE PRECISION,
    "CustomerID" TEXT,
    "CreatedAt" TIMESTAMP(3),
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" SERIAL NOT NULL,
    "variantId" TEXT NOT NULL,
    "shopId" INTEGER,
    "exchangeOnlyPrice" DOUBLE PRECISION,
    "finalSalePrice" DOUBLE PRECISION,
    "easyReturnsPrice" DOUBLE PRECISION,
    "internationalShipping" BOOLEAN,
    "eligibilityFlag" BOOLEAN,
    "rank" INTEGER,
    "campaignId" INTEGER,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "campaignId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_email_key" ON "TeamMember"("email");

-- CreateIndex
CREATE INDEX "Product_productId_idx" ON "Product"("productId");

-- CreateIndex
CREATE INDEX "Product_handle_idx" ON "Product"("handle");

-- CreateIndex
CREATE INDEX "Campaign_shopId_idx" ON "Campaign"("shopId");

-- CreateIndex
CREATE INDEX "CampaignProduct_campaignId_idx" ON "CampaignProduct"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignProduct_productId_idx" ON "CampaignProduct"("productId");

-- CreateIndex
CREATE INDEX "Pricing_shopId_idx" ON "Pricing"("shopId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProduct" ADD CONSTRAINT "CampaignProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
