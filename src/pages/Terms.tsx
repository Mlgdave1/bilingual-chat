import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using BilingualChat, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p>BilingualChat provides real-time translation services for messages between users. The service includes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Message translation</li>
              <li>Chat functionality</li>
              <li>User accounts</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>To use BilingualChat, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account with valid information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us of any unauthorized use</li>
              <li>Be at least 13 years old</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Harass or harm other users</li>
              <li>Transmit malware or viruses</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Use the service for spam or advertising</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
            <p>BilingualChat and its original content are protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written permission.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Termination</h2>
            <p>We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p>In no event shall BilingualChat be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p className="mt-2">Email: support@bilingual-chat.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}