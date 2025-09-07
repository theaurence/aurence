"use client";
import { useState } from "react";

export default function Creator() {
  const [available] = useState([
    {
      id: "a1",
      brand: "GlowSkin Co.",
      title: "Summer Launch Giveaway",
      payout: "$250 + products",
    },
    {
      id: "a2",
      brand: "NoteMate",
      title: "Student Starter Pack",
      payout: "$150 per post",
    },
    {
      id: "a3",
      brand: "FitFuel",
      title: "Healthy Morning Routine",
      payout: "$300 + affiliate",
    },
  ]);

  return (
    <main className="min-h-screen bg-black text-white px-6">
      <section className="mx-auto max-w-6xl pt-6 md:pt-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Welcome, Creator!</h1>
            <p className="text-gray-300 mt-2">Discover brand collabs curated for you.</p>
          </div>
          <button
            onClick={() => alert("Browse Collaborations: Placeholder action")}
            className="inline-flex items-center justify-center rounded-lg bg-white text-black px-5 py-3 hover:bg-gray-200 transition"
          >
            Browse Collaborations
          </button>
        </header>

        <h2 className="text-xl font-medium mb-4">Available Collabs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map((c) => (
            <article key={c.id} className="group border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/50 transition bg-gray-900/30">
              <p className="text-sm text-gray-400 mb-1">{c.brand}</p>
              <h3 className="text-lg font-semibold tracking-tight text-white mb-2">{c.title}</h3>
              <p className="text-gray-300 mb-4">Compensation: {c.payout}</p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition">View</button>
                <button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition">Apply</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
