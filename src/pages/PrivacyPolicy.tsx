import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (email address)</li>
              <li>Profile information (name, profile picture)</li>
              <li>Messages and translations</li>
              <li>Information from third-party services (Google)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete translations</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
            <p>We do not share your personal information except:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>With your consent</li>
              <li>To comply with laws</li>
              <li>To protect our rights</li>
              <li>In connection with a merger or sale of our business</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>We use reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Changes to Privacy Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at:</p>
            <p className="mt-2">Email: support@bilingual-chat.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}