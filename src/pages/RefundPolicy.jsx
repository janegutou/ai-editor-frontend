import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: April 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Overview</h2>
        <p className="text-gray-700">
          At Writyzen, we strive to provide high-quality AI-powered writing assistance. If you are not satisfied with your purchase, we offer refunds under specific conditions outlined below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Subscription Refunds</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>If you cancel your subscription within the first <strong>7 days</strong>, you may request a full refund.</li>
          <li>After 7 days, we do not provide refunds for partially used subscription periods.</li>
          <li>If you were charged due to an <strong>accidental renewal</strong>, contact us within <strong>48 hours</strong> of the charge to request a refund.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">One-Time Purchases</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Refunds for one-time purchases will be considered within <strong>7 days</strong> if you have not used a significant portion of the product.</li>
          <li>If the purchase includes downloadable content or digital access, refunds may not be available once accessed.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Non-Refundable Cases</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>You changed your mind after purchase.</li>
          <li>You used the service extensively before requesting a refund.</li>
          <li>You violated our <a href="/terms-of-service" className="text-blue-500 underline">Terms of Service</a>.</li>
          <li>Refund requests beyond the eligible time frame.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How to Request a Refund</h2>
        <p className="text-gray-700">
          To request a refund, please contact us at <strong>support@writyzen.com</strong> with the following details:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Your order number or transaction ID.</li>
          <li>The reason for the refund request.</li>
          <li>Any relevant details to help us process your request.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Refunds are typically processed within <strong>5-10 business days</strong>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
        <p className="text-gray-700">
          We may update our refund policy from time to time. Any major changes will be posted on this page.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about our refund policy, please contact:
        </p>
        <p className="text-gray-700 font-semibold">📩 support@writyzen.com</p>
      </section>
    </div>
  );
};

export default RefundPolicy;
