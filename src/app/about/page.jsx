"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-[#f8fafc] to-[#ffffff] px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* HERO SECTION */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">

         

          {/* INTRO */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              About Dr. Divine O. Asiriuwa
            </h1>

            <p className="text-green-600 font-medium mt-1">
              Certified Clinical Nutritionist & Wellness Coach
            </p>

            <p className="text-gray-600 mt-4 leading-relaxed">
              I help people build healthier relationships with food, improve their
              nutrition habits, and achieve sustainable wellness through science-backed
              dietary guidance and lifestyle coaching.
            </p>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                My Mission
              </h2>
              <p className="text-gray-700 mt-3 leading-relaxed">
                My mission is to simplify nutrition and make healthy living accessible
                to everyone. I believe food should not be complicated — it should be
                nourishing, enjoyable, and sustainable for life.
              </p>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Areas of Focus
              </h2>

              <ul className="mt-3 space-y-2 text-gray-700 list-disc pl-5">
                <li>Weight management & fat loss nutrition</li>
                <li>Meal planning for busy lifestyles</li>
                <li>Diabetes & blood sugar control diets</li>
                <li>Gut health & digestion improvement</li>
                <li>Sports & performance nutrition</li>
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                My Philosophy
              </h2>

              <p className="text-gray-700 mt-3 leading-relaxed">
                I don’t believe in extreme diets or quick fixes. Instead, I focus on
                balanced nutrition, consistency, and understanding your body’s needs.
                Small habits, practiced daily, lead to lasting transformation.
              </p>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                Credentials
              </h2>

              <ul className="mt-3 space-y-2 text-gray-700 list-disc pl-5">
                <li>BSc. Human Nutrition & Dietetics</li>
                <li>Certified Clinical Nutritionist (CNC)</li>
                <li>Member, Nutrition Society of Nigeria</li>
                <li>5+ years in private nutrition consulting</li>
              </ul>
            </section>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-12 bg-green-600 text-white rounded-3xl p-10 text-center shadow-lg">
          <h2 className="text-3xl font-bold">Let’s Build Your Health Together</h2>

          <p className="mt-3 text-white/90">
            Whether you're trying to lose weight, eat better, or manage a condition,
            I’m here to guide you every step of the way.
          </p>

          <a
            href="/contact"
            className="inline-block mt-6 bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Book a Consultation
          </a>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Nutrition with Dr. Divine O. Asiriuwa
        </p>
      </div>
    </main>
  );
}