import React from "react";

const Demo = () => {
  // Feature demo data
  const features = [
    {
      title: "Smart Content Expansion",
      description: "Automatically extend your highlevel ideas into more detailed and specific content.",
      gif: "expand_sample.gif",
    },
    {
      title: "One-Click File Download",
      description: "Download your working document as a word file.",
      gif: "download_sample.gif",
    },
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 text-secondary">Feature Demos</h1>
        </div>

        {/* Demo List */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div key={index} className="group">
              {/* Title & Description */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h2>
                <p className="text-lg text-gray-600">{feature.description}</p>
              </div>

              {/* GIF Container */}
              <div className="overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 group-hover:shadow-xl hover:border-blue-500">
                <img
                  src={feature.gif}
                  alt={`${feature.title} Demo`}
                  className="w-full h-auto object-contain cursor-zoom-in"
                  onClick={() => window.open(feature.gif, "_blank")}
                />
              </div>

              {/* Divider (except last item) */}
              {index !== features.length - 1 && (
                <div className="mt-20 border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Demo;