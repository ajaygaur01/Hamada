const certifications = [
  { label: "FSSAI Certified", icon: "shield" },
  { label: "ISO 22000", icon: "check-circle" },
  { label: "JAS Organic", icon: "leaf" },
  { label: "HACCP", icon: "award" },
  { label: "FDA Approved", icon: "file-check" },
  { label: "Halal Certified", icon: "globe" },
];

function CertIcon({ type }: { type: string }) {
  const cls = "w-6 h-6 text-[#E7DDC1]";
  switch (type) {
    case "shield":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "check-circle":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "leaf":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case "award":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case "file-check":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case "globe":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Awards() {
  return (
    <section className="bg-[#4E3D33] py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold tracking-widest uppercase text-[#E7DDC1]/80 mb-3">
          RECOGNITION
        </p>
        <h2 className="text-2xl font-bold text-white mb-4">
          Awards and Certifications
        </h2>
        <p className="text-sm text-[#E7DDC1]/70 mb-16 max-w-xl mx-auto">
          Our quality standards are verified by leading international food safety, testing
          industry and food safety bodies.
        </p>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
          {certifications.map((cert, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#3e3028] border border-[#3e3028] flex items-center justify-center mb-3 shadow-sm">
                <CertIcon type={cert.icon} />
              </div>
              <span className="text-[10px] text-[#E7DDC1]/80 font-medium">{cert.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
