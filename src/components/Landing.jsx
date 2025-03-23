import React from "react";
import { useNavigate } from "react-router-dom";



const LandingPage = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Boost Your Writing Efficiency with AI
        </h1>
        <p className="text-lg mb-6">
          Easily generate, rewrite, and expand your content with AI-powered
          suggestions. Perfect for writers, content creators, and professionals!
        </p>
        <button 
          className="bg-yellow-500 text-black px-6 py-3 rounded-full text-xl hover:bg-yellow-400"
          onClick={() => navigate('/editor')}
        > 
          Try It Now
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Content Expansion</h3>
            <p>
              Transform your brief outlines into detailed, well-rounded content
              automatically. Add depth and context effortlessly.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Text Rewriting</h3>
            <p>
              Revise your text with AI-generated rewrites that maintain your
              message but improve clarity and style.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Custom Prompts</h3>
            <p>
              Tailor your writing experience with customizable prompts that guide
              the AI to generate text as per your style.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-100 py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">How it Works</h2>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold">Step 1: Input Your Content</h3>
            <p>Start by typing your content or selecting existing text to enhance.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">Step 2: Choose Your Mode</h3>
            <p>Select the mode you need: Rewrite or Expand. Tailor the AI to suit your needs.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">Step 3: Get AI-Generated Text</h3>
            <p>Receive high-quality AI text ready for immediate use. Save time and boost productivity.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">What Our Users Say</h2>
        <div className="text-center">
          <blockquote className="italic text-lg mb-4">
            "This tool has completely transformed my writing process. It’s
            faster, more efficient, and the AI-generated suggestions are spot on!"
          </blockquote>
          <p className="font-semibold">John Doe, Content Writer</p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-blue-500 text-white py-12 px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Boost Your Writing?</h2>
        <button 
          className="bg-yellow-500 text-black px-6 py-3 rounded-full text-xl hover:bg-yellow-400"
          onClick={() => navigate('/editor')}
        > 
          Start Now
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
