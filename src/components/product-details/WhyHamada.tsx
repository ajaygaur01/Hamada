import { Check } from "lucide-react";

interface WhyHamadaProps {
  productName: string;
}

export default function WhyHamada({ productName }: WhyHamadaProps) {
  // Extract a short name for the table header, e.g. "Gyokuro" or "Matcha"
  let shortName = "Gyokuro";
  if (productName.toLowerCase().includes("matcha")) {
    shortName = "Matcha";
  } else if (productName.toLowerCase().includes("hojicha")) {
    shortName = "Hojicha";
  } else if (productName.toLowerCase().includes("sencha")) {
    shortName = "Sencha";
  } else if (productName.toLowerCase().includes("genmaicha")) {
    shortName = "Genmaicha";
  } else {
    // split by space and take first word or two
    const parts = productName.split(" ");
    shortName = parts.length > 1 ? parts[1] : parts[0];
  }

  const rows = [
    { feature: "Direct from Kagoshima", hamada: "✔", generic: "–" },
    { feature: "Shade Grown", hamada: "✔", generic: "Sometimes" },
    { feature: "First Flush Harvest", hamada: "✔", generic: "Mixed" },
    { feature: "Umami & Sweetness", hamada: "✔", generic: "Less Consistent" },
    { feature: "Consistent Batches", hamada: "✔", generic: "Inconsistent" },
    { feature: "Export Documentation", hamada: "✔", generic: "–" },
    { feature: "MOQ Friendly", hamada: "✔", generic: "High MOQ" },
  ];

  return (
    <div className="space-y-6 pt-8 border-t border-zinc-200">
      <h3 className="font-serif text-2xl text-[#3E4F25] font-semibold leading-tight">
        Why Hamada {shortName}?
      </h3>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="p-4 font-semibold text-zinc-500 w-[42%] bg-zinc-50/50"></th>
              <th className="p-4 font-bold text-white text-center w-[29%] bg-[#3E4F25]">
                Hamada {shortName}
              </th>
              <th className="p-4 font-semibold text-zinc-500 text-center w-[29%] bg-zinc-50">
                Generic Importers
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                <td className="p-4 font-semibold text-zinc-700">{row.feature}</td>
                {/* Hamada Column with custom highlighting and checkmark circle */}
                <td className="p-4 text-center bg-[#3E4F25]/2 border-x border-[#3E4F25]/10 font-bold text-[#3E4F25]">
                  <div className="flex justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#4C632E] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center text-zinc-500 font-medium">{row.generic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
