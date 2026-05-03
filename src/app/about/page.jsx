"use client";

import React from "react";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
    <Head>
        <title>About Us | NutriBlog</title>
        <meta
          name="description"
          content="Learn more about NutriBlog and our mission to simplify nutrition and healthy living."
        />
        <link
          rel="canonical"
          href="https://www.nutribloghub.com/about"
        />
      </Head>
    <div className="max-w-5xl mx-auto px-6 py-16 text-gray-800">

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700">
          About NutriBlog
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Simple, science-backed nutrition guidance to help you live healthier,
          feel better, and make smarter food choices every day.
        </p>
      </div>

      {/* Our Story */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Our Story
        </h2>
        <p className="text-gray-700 leading-relaxed">
          NutriBlog was created with one mission — to make nutrition easy to understand and practical to apply.
          In a world full of confusing diet trends and misinformation, we focus on clarity, balance, and real-life results.
          Whether you're trying to lose weight, gain muscle, or simply eat better, we’re here to guide you step by step.
        </p>
      </div>

      {/* What We Offer */}
      <div className="mb-12 grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2">🥗 Nutrition Guides</h3>
          <p className="text-sm text-gray-700">
            Easy-to-follow articles on healthy eating, meal planning, and diet improvement.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2">⚖️ Weight Goals</h3>
          <p className="text-sm text-gray-700">
            Practical tips for weight loss, weight gain, and maintaining a healthy balance.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2">🧠 Science-Based Info</h3>
          <p className="text-sm text-gray-700">
            We break down complex nutrition science into simple, actionable advice.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Our Mission
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Our mission is to empower people with knowledge that actually works in real life —
          not extreme diets or temporary fixes, but sustainable habits that improve your health long-term.
        </p>
      </div>

      {/* Closing CTA */}
      <div className="text-center mt-16 p-10 bg-green-700 text-white rounded-2xl">
        <h2 className="text-2xl font-semibold mb-2">
          Start Your Healthy Journey Today
        </h2>
        <p className="text-green-100 mb-4">
          Explore our latest nutrition tips and take control of your health one meal at a time.
        </p>
        <a
          href="/blog"
          className="inline-block bg-white text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Read Articles
        </a>
      </div>

    </div>
    </>
  );
};

export default AboutPage;