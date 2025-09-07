export default function Contact() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <h1 className="text-5xl font-semibold mb-6">Contact Us</h1>
        <p className="text-lg text-gray-300 mb-10 text-center">
          Have questions? We'd love to hear from you.  
          Reach out and our team will get back to you quickly.
        </p>
  
        <form className="w-full max-w-md bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 text-white rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition"
          >
            Send Message
          </button>
        </form>
      </main>
    );
  }
  