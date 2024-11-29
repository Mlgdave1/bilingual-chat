import React from 'react';
import { MessageCircle, Languages, Brain, Lock, Globe2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqs = [
    {
      question: "How does BilingualChat work?",
      answer: "BilingualChat uses advanced AI to provide real-time translations between languages. Simply type or speak your message, and it will be instantly translated for the other person to understand.",
      icon: MessageCircle,
    },
    {
      question: "What languages are supported?",
      answer: "Currently, we support English and Spanish with perfect translations. We're adding support for 9 more languages soon: French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, and Korean.",
      icon: Languages,
    },
    {
      question: "How does the learning system work?",
      answer: "Our learning system analyzes your conversations and creates personalized quizzes based on the words and phrases you use most. You'll receive weekly reminders to test your knowledge and track your progress.",
      icon: Brain,
    },
    {
      question: "Is my conversation data private?",
      answer: "Yes, absolutely! All conversations in private chats are encrypted and only accessible to the participants. We never share your data with third parties.",
      icon: Lock,
    },
    {
      question: "Can I use BilingualChat for in-person conversations?",
      answer: "Yes! Our Quick Translate feature is perfect for in-person conversations. Just tap the microphone button, speak your message, and show the translation to the other person.",
      icon: Globe2,
    },
    {
      question: "How accurate are the translations?",
      answer: "We use state-of-the-art AI models to ensure high accuracy. Our system also maintains context and tone across translations for more natural conversations.",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-400">
            Everything you need to know about BilingualChat
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-dark-200 rounded-lg p-6 border border-dark-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent-600/10 rounded-lg">
                  <faq.icon className="text-accent-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-100 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Still have questions? We're here to help!
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}