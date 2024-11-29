import { Link } from 'react-router-dom';
import { MessageCircle, Globe2, Zap, Heart, ArrowRight, MessageSquare, Users, Lock, Globe, Briefcase, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2784&q=80"
            alt="People connecting"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-50/95 to-dark-50/90 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 text-gray-100"
          >
            Break Language Barriers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto"
          >
            Connect seamlessly in English and Spanish. Perfect for bilingual couples and friends.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-accent-400 mb-8"
          >
            9 more languages coming soon!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/chat"
              className="bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-700 transition-colors inline-flex items-center gap-2"
            >
              Try Global Chat <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-dark-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-100">
            Why Choose BilingualChat?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-xl bg-dark-300 border border-dark-400"
            >
              <Globe className="text-accent-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2 text-gray-100">11+ Languages</h3>
              <p className="text-gray-400">Support for major world languages with more coming soon.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-xl bg-dark-300 border border-dark-400"
            >
              <Zap className="text-accent-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Lightning Fast</h3>
              <p className="text-gray-400">Messages are translated instantly as you type.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-xl bg-dark-300 border border-dark-400"
            >
              <Heart className="text-accent-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Natural Conversations</h3>
              <p className="text-gray-400">AI-powered translations that maintain context and tone.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connect Without Boundaries Section */}
      <section className="py-24 bg-dark-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-12 text-gray-100">
                Connect Without Boundaries
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Globe2 className="text-accent-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-200">Global Communication</h3>
                    <p className="text-gray-400">Chat with anyone, regardless of their native language.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Briefcase className="text-accent-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-200">Business & Personal</h3>
                    <p className="text-gray-400">Perfect for both professional and personal communication.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="text-accent-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-200">Private & Secure</h3>
                    <p className="text-gray-400">Your conversations are private and protected.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Connected world"
                className="relative rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-50 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-accent-400" />
              <span className="font-bold text-gray-200">BilingualChat</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-gray-200 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-200 transition-colors">
                Terms of Service
              </Link>
            </div>
            <p>© 2024 BilingualChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}