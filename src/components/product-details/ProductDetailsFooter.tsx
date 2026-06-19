import { Truck, ShieldCheck, FileText, PhoneCall } from "lucide-react";

export default function ProductDetailsFooter() {
  const items = [
    {
      icon: <Truck className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      title: "Free Shipping",
      desc: "On all orders above MOQ",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      title: "Secure Payments",
      desc: "Multiple payment options",
    },
    {
      icon: <FileText className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      title: "Export Documentation",
      desc: "Included with every order",
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-[#4C632E]" strokeWidth={1.5} />,
      title: "Need help?",
      desc: "+91 98999 23445",
      href: "tel:+919899923445",
    },
  ];

  return (
    <div className="border-y border-zinc-200 bg-white py-8 my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => {
            const content = (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-zinc-100 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-800 text-sm leading-tight">{item.title}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <a
                  key={i}
                  href={item.href}
                  className="hover:opacity-80 transition-opacity block"
                >
                  {content}
                </a>
              );
            }

            return <div key={i}>{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
