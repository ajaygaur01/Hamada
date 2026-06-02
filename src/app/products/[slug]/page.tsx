import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Breadcrumb from "@/components/product-details/Breadcrumb";
import ImageGallery from "@/components/product-details/ImageGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import OrderForm from "@/components/product-details/OrderForm";
import BrewingGuide from "@/components/product-details/BrewingGuide";
import ReviewsSection from "@/components/product-details/ReviewsSection";
import WhyHamada from "@/components/product-details/WhyHamada";
import ProductDetailsFooter from "@/components/product-details/ProductDetailsFooter";
import { sortProductImagesForGallery } from "@/lib/product-images";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Kaori by Chiran`,
    description: product.short_description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: { is_active: true },
        orderBy: { sample_price: "asc" },
      },
      images: {
        orderBy: { display_order: "asc" },
      },
      reviews: {
        include: {
          user: {
            select: { full_name: true },
          },
        },
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const galleryImages = sortProductImagesForGallery(product.images).filter(
    (img) => img.image_url?.trim()
  );

  // Derive a short category tag from the product name (e.g. "Matcha" from "Matcha - Ceremonial Grade")
  const categoryTag = product.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "");

  const variantSizes = product.variants.map((v) => v.size);

  const variants = product.variants.map((v) => ({
    id: v.id,
    size: v.size,
    samplePrice: Number(v.sample_price),
    bulkPrice: Number(v.bulk_price),
    minBulkQuantity: v.min_bulk_quantity,
  }));

  // Format reviews for client component
  const formattedReviews = product.reviews.map((r) => {
    let name = "Anonymous";
    if (r.user.full_name) {
      const parts = r.user.full_name.split(" ");
      name = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
    }
    return {
      id: r.id,
      rating: r.rating,
      reviewText: r.review_text,
      createdAt: r.created_at.toISOString(),
      user: { name },
    };
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb productName={product.name} categoryName={product.category.name} />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Gallery, Specs, Use Cases, Comparison Table */}
          <div className="lg:col-span-7 space-y-10">
            {/* Image Gallery */}
            <ImageGallery
              images={galleryImages.map((img) => ({
                url: img.image_url,
                alt: img.alt_text || product.name,
                isPrimary: img.is_primary,
              }))}
            />

            {/* Product Metadata, Ratings, Best For and Specifications */}
            <ProductInfo
              productId={product.id}
              categoryTag={categoryTag || "TEA"}
              grade={product.grade}
              name={product.name}
              shortDescription={product.short_description}
              fullDescription={product.full_description}
              useCases={product.use_cases || []}
              variantSizes={variantSizes}
              storageInstructions={product.storage_instructions}
              shelfLife={product.shelf_life}
              productSlug={product.slug}
              categoryName={product.category.name}
            />

            {/* Brand Comparison Table */}
            <WhyHamada productName={product.name} />
          </div>

          {/* Right Column: Sticky Sidebar Order Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-[100px]">
            <OrderForm variants={variants} productSlug={product.slug} />
          </div>
          
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <ProductDetailsFooter />

      {/* Brewing Guide */}
      <BrewingGuide />

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ReviewsSection productId={product.id} initialReviews={formattedReviews} />
      </div>
    </div>
  );
}
