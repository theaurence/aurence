export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0/mo",
      features: ["Up to 3 collabs", "Basic search", "Email support"],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29/mo",
      features: ["Unlimited collabs", "Advanced filters", "Priority support"],
      cta: "Get Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["SLA & SSO", "Dedicated manager", "Custom integrations"],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-300">Choose the plan that fits your stage.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`border border-gray-800 rounded-2xl p-8 hover:bg-gray-900/50 transition bg-gray-900/30 ${
                t.highlighted ? "ring-1 ring-white" : ""
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{t.name}</h2>
              <p className="text-3xl font-bold mb-6">{t.price}</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full px-5 py-3 rounded-lg transition ${t.highlighted ? "bg-white text-black hover:bg-gray-200" : "border border-gray-700 hover:bg-gray-800"}`}>
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
