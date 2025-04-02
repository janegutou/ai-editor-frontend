import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-6">Last updated: April 2025</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Acceptance of Terms</h2>
        <p className="text-gray-700">
          By accessing or using Writyzen, you confirm that you are at least 18
          years old (or meet the minimum legal age in your country) and have the
          legal capacity to enter into this agreement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Description of the Service</h2>
        <p className="text-gray-700">
          Writyzen provides an AI-powered text generation service, allowing users to:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Rewrite selected text with enhanced clarity and detail</li>
          <li>Continue writing based on existing content</li>
          <li>Customize writing prompts for tailored results</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Account Registration & Security</h2>
        <p className="text-gray-700">
          You may need to create an account to access certain features of Writyzen.
          You agree to provide accurate and complete information during registration.
          You are responsible for maintaining the confidentiality of your account and password.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">User Conduct</h2>
        <p className="text-gray-700">
          By using Writyzen, you agree:
        </p>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Not to generate, distribute, or facilitate illegal or harmful content.</li>
          <li>Not to attempt to reverse-engineer or disrupt Writyzen's AI models.</li>
          <li>Not to use Writyzen for spam or plagiarism.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          We reserve the right to suspend or terminate accounts violating these rules.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Subscription & Payment</h2>
        <p className="text-gray-700">
          Certain Writyzen features may require a paid subscription. Payments are securely processed through Paddle.
          Refunds are subject to our <a href="/refund-policy" className="text-blue-500 underline">Refund Policy</a>.  
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
        <p className="text-gray-700">
          All AI-generated content belongs to the user, but Writyzen retains the right to analyze anonymized usage data.
          Writyzen's platform, including its software, AI models, and website, remains the exclusive property of Writyzen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Data & Privacy</h2>
        <p className="text-gray-700">
          We do not store or retain AI-generated content beyond the session.
          User data is processed in accordance with our <a href="/privacy-policy" className="text-blue-500 underline">Privacy Policy</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Service Availability & Disclaimer</h2>
        <p className="text-gray-700">
          Writyzen is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted service or specific results.
          We are not liable for any AI-generated content or its consequences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Modifications to the Terms</h2>
        <p className="text-gray-700">
          We may update these Terms from time to time. If significant changes occur, we will notify users via email or on our website.
          Continued use of Writyzen after modifications constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700">
          For any questions regarding these Terms, please contact us at:
        </p>
        <p className="text-gray-700 font-semibold">📩 support@writyzen.com</p>
      </section>
    </div>
  );
};

export default TermsOfService;
