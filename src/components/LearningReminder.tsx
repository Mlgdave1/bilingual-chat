import React, { useState, useEffect } from 'react';
import { Brain, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { LearningQuiz } from './LearningQuiz';

interface LearningReminderProps {
  userId: string;
}

export function LearningReminder({ userId }: LearningReminderProps) {
  const [showReminder, setShowReminder] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');

  useEffect(() => {
    checkLearningReminder();
  }, [userId]);

  const checkLearningReminder = async () => {
    try {
      // Check last quiz date
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_quiz_date, languages')
        .eq('id', userId)
        .single();

      if (!profile) return;

      const lastQuizDate = new Date(profile.last_quiz_date || 0);
      const daysSinceLastQuiz = Math.floor(
        (Date.now() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Show reminder if it's been a week since last quiz
      if (daysSinceLastQuiz >= 7) {
        // Determine target language based on chat history
        const { data: messages } = await supabase
          .from('messages')
          .select('text, translation')
          .eq('sender_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (messages && messages.length > 0) {
          // Simple language detection based on recent messages
          const hasSpanish = messages.some(msg => 
            /[áéíóúñ¿¡]/.test(msg.text) || 
            /\b(hola|gracias|por favor)\b/i.test(msg.text)
          );
          setTargetLanguage(hasSpanish ? 'Spanish' : 'English');
          setShowReminder(true);
        }
      }
    } catch (error) {
      console.error('Error checking learning reminder:', error);
    }
  };

  const handleStartQuiz = () => {
    setShowReminder(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = async () => {
    try {
      // Update last quiz date
      await supabase
        .from('profiles')
        .update({ last_quiz_date: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating quiz date:', error);
    }
  };

  if (!showReminder && !showQuiz) return null;

  return (
    <>
      {showReminder && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-dark-200 rounded-lg shadow-lg p-4 max-w-sm border border-dark-300 z-50"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="text-accent-400" size={20} />
              <h3 className="font-medium text-gray-100">Time to Practice!</h3>
            </div>
            <button
              onClick={() => setShowReminder(false)}
              className="p-1 hover:bg-dark-300 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          
          <p className="text-sm text-gray-400 mb-4">
            Ready to test your {targetLanguage} skills? Take a quick quiz based on your recent conversations!
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowReminder(false)}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleStartQuiz}
              className="px-3 py-1.5 text-sm bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </motion.div>
      )}

      <LearningQuiz
        isOpen={showQuiz}
        onClose={() => {
          setShowQuiz(false);
          handleQuizComplete();
        }}
        userId={userId}
        targetLanguage={targetLanguage}
      />
    </>
  );
}