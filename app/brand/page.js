"use client";
import { useState } from "react";

export default function Brand() {
  const [collabs] = useState([
    {
      id: "c1",
      title: "Summer Launch Giveaway",
      description: "Looking for creators to promote our new skincare line.",
      status: "Active",
    },
    {
      id: "c2",
      title: "Back-to-School Campaign",
      description: "Micro-influencers in lifestyle and study niches.",
      status: "Draft",
    },
    {
      id: "c3",
      title: "Holiday Unboxing",
      description: "Short-form video creators for festive unboxings.",
      status: "Active",
    },
  ]);

  return (
    <main className="min-h-screen bg-black text-white px-6">
      <section className="mx-auto max-w-6xl pt-6 md:pt-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Welcome, Brand!</h1>
            <p className="text-gray-300 mt-2">Manage collaborations and grow your brand presence.</p>
          </div>
          <button
            onClick={() => alert("Post Collaboration: Placeholder action")}
            className="inline-flex items-center justify-center rounded-lg bg-white text-black px-5 py-3 hover:bg-gray-200 transition"
          >
            Post a Collaboration
          </button>
        </header>

        <h2 className="text-xl font-medium mb-4">Your Collabs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collabs.map((c) => (
            <article key={c.id} className="group border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/50 transition bg-gray-900/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold tracking-tight text-white">{c.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-300">{c.status}</span>
              </div>
              <p className="text-gray-300 mb-4">{c.description}</p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition">View</button>
                <button className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition">Edit</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
