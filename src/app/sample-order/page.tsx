import prisma from "@/lib/prisma";
import SampleOrderPageClient from "@/components/sample-order/SampleOrderPageClient";
import { getServerAuthUser } from "@/lib/auth/server-session";

type SearchParams = Promise<{
  product?: string | string[];
  variant?: string | string[];
}>;

type Props = {
  searchParams: SearchParams;
};

function isSampleSize(size: string) {
  const numericSize = Number.parseInt(size, 10);
  return Number.isFinite(numericSize) ? numericSize <= 100 : true;
}

export default async function SampleOrderPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialProductSlug = typeof params.product === "string" ? params.product : "";
  const initialVariantId = typeof params.variant === "string" ? params.variant : "";
  const authUser = await getServerAuthUser();

  const products = await prisma.product.findMany({
    where: {
      is_active: true,
      variants: {
        some: {
          is_active: true,
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      variants: {
        where: { is_active: true },
        select: {
          id: true,
          size: true,
          sample_price: true,
        },
        orderBy: { sample_price: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const productOptions = products
    .map((product) => {
      const sampleVariants = product.variants.filter((variant) => isSampleSize(variant.size));
      const variantsToUse = sampleVariants.length > 0 ? sampleVariants : product.variants;

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        variants: variantsToUse.map((variant) => ({
          id: variant.id,
          size: variant.size,
          samplePrice: Number(variant.sample_price),
        })),
      };
    })
    .filter((product) => product.variants.length > 0);

  const selectedProduct = productOptions.find((product) => product.slug === initialProductSlug);
  const selectedVariant = selectedProduct?.variants.find((variant) => variant.id === initialVariantId);

  if (!selectedProduct || !selectedVariant) {
    return (
      <SampleOrderPageClient
        selectedProduct={null}
        selectedVariantId=""
        initialUser={{
          username: authUser?.username ?? "",
          email: authUser?.email ?? "",
          phone: authUser?.phone ?? "",
        }}
      />
    );
  }

  return (
    <SampleOrderPageClient
      selectedProduct={selectedProduct}
      selectedVariantId={selectedVariant.id}
      initialUser={{
        username: authUser?.username ?? "",
        email: authUser?.email ?? "",
        phone: authUser?.phone ?? "",
      }}
    />
  );
}
