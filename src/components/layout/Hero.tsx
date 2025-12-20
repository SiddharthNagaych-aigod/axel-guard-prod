import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="https://res.cloudinary.com/dyn049kt9/video/upload/v1766159788/axelguard/2435376-uhd_3840_2160_30fps.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
          Welcome to AxelGuard
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
          Leaders in vehicle safety systems and customized tracking solutions. 
          Ensuring safety efficiently and reliably.
        </p>
        <Link 
          href="/products" 
          className="inline-block text-black px-8 py-4 rounded-full font-bold text-lg bg-white hover:text-black transition-all duration-300 shadow-lg animate-fade-in-up delay-300"
        >
          Explore Products
        </Link>
      </div>
    </section>
  );
}
