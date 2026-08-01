import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      className="relative h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <div className="inline-block border border-yellow-500/40 rounded-full px-5 py-2 mb-6 bg-black/20 backdrop-blur-sm">
  <span className="text-yellow-300 text-sm tracking-[0.3em] uppercase">
    Since 1995 • Authentic Kashmiri Craftsmanship
  </span>
</div>

<h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-white">
  Kashmir Royale Shawls
</h1>
<p className="mt-3 text-2xl md:text-3xl font-light text-white">
  Luxury Shawls & Premium Pashmina
</p>

        <p className="mt-8 text-2xl text-yellow-400 font-semibold">
          Authentic Kashmiri Shawls • Pashmina • Luxury Suits Since 1995
        </p>

        <p className="mt-8 text-lg md:text-xl text-gray-200 leading-8">
          Since 1995, our family has been preserving the timeless beauty of
          authentic Kashmiri craftsmanship through handcrafted shawls,
          luxurious Pashmina, elegant suits and premium fashion collections.
        </p>

        <div className="mt-10 flex justify-center gap-6 flex-wrap">
          <a
            href="#collections"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition"
          >
            View Collection
          </a>

          <a
            href="https://wa.me/917298129017"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white hover:bg-green-600 hover:border-green-600 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition"
          >
            <FaWhatsapp size={22} />
            WhatsApp Order
          </a>
        </div>
      </div>
    </section>
  );
}