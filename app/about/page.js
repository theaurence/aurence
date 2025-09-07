export default function About() {
  return (
    <main className="min-h-screen bg-black text-white px-6">
      <section className="mx-auto max-w-6xl pt-10 md:pt-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Built for effortless collaborations</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Aurence is a platform where creators and brands collaborate. Find collabs. Grow together.
            Our minimalist design keeps the focus on what matters most: discovering opportunities and managing partnerships
            with clarity.
          </p>
        </div>
        <div className="w-full h-64 md:h-80 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
          <span className="text-gray-400">Illustration Placeholder</span>
        </div>
      </section>
    </main>
  );
}
