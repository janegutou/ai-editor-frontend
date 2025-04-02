import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: April 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-700">
          Welcome to Writyzen. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your data when you use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Data We Collect</h2>
        <p className="text-gray-700">
          We collect the following types of data when you use Writyzen:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Basic account information (e.g., email, username) when you register.</li>
          <li>Payment details processed securely through Paddle (we do not store payment data).</li>
          <li>Usage data, such as interaction with AI-generated content, to improve our service.</li>
          <li>Cookies and tracking data to optimize user experience.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How We Use Your Data</h2>
        <p className="text-gray-700">
          We use collected data for the following purposes:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>To provide and improve Writyzen services.</li>
          <li>To process transactions securely through our payment provider.</li>
          <li>To personalize user experience and enhance AI-generated results.</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Data Storage & Security</h2>
        <p className="text-gray-700">
          - We do not permanently store AI-generated content or user inputs.<br />
          - Your account data is stored securely with encryption and access control measures.<br />
          - Payment information is processed by Paddle, and we do not retain sensitive payment details.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Third-Party Services</h2>
        <p className="text-gray-700">
          Writyzen uses third-party services such as:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li><strong>Paddle:</strong> For payment processing.</li>
          <li><strong>Cloudflare:</strong> For security and CDN performance optimization.</li>
          <li><strong>Analytics Tools:</strong> To understand how users interact with our service.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
        <p className="text-gray-700">
          Depending on your location, you have rights over your personal data, including:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>The right to access and update your personal data.</li>
          <li>The right to request deletion of your account and associated data.</li>
          <li>The right to opt out of data tracking (such as analytics cookies).</li>
        </ul>
        <p className="text-gray-700 mt-2">
          You can request data changes or deletions by contacting <strong>support@writyzen.com</strong>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Cookies & Tracking</h2>
        <p className="text-gray-700">
          Writyzen uses cookies to enhance functionality and improve user experience. You can disable cookies in your browser settings if desired.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time. Any major changes will be communicated via email or our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-700 font-semibold">📩 support@writyzen.com</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
