import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  context: string;
}

interface LearningQuizProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  targetLanguage: string;
}

export function LearningQuiz({ isOpen, onClose, userId, targetLanguage }: LearningQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateQuiz();
    }
  }, [isOpen, userId, targetLanguage]);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      // Fetch user's chat history
      const { data: messages } = await supabase
        .from('messages')
        .select('text, translation')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!messages || messages.length === 0) {
        throw new Error('No chat history found');
      }

      // Generate quiz questions using OpenAI
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          targetLanguage,
        }),
      });

      const quizQuestions = await response.json();
      setQuestions(quizQuestions);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-100/95 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-dark-200 rounded-xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b border-dark-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="text-accent-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-100">
                Language Learning Quiz
              </h2>
            </div>
            {!showResult && (
              <div className="text-sm text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
              <p className="mt-4 text-gray-400">Generating your personalized quiz...</p>
            </div>
          ) : showResult ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-100 mb-2">
                Quiz Complete!
              </h3>
              <p className="text-gray-400 mb-6">
                You scored {score} out of {questions.length}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={generateQuiz}
                  className="px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-dark-300 text-gray-200 rounded-lg hover:bg-dark-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-100 mb-4">
                  {questions[currentQuestion].question}
                </h3>
                {questions[currentQuestion].context && (
                  <div className="bg-dark-300 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-400">Context:</p>
                    <p className="text-gray-200">{questions[currentQuestion].context}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      isAnswered
                        ? option === questions[currentQuestion].correctAnswer
                          ? 'bg-green-600/20 border-green-500'
                          : option === selectedAnswer
                          ? 'bg-red-600/20 border-red-500'
                          : 'bg-dark-300 border-transparent'
                        : 'bg-dark-300 hover:bg-dark-400 border-transparent'
                    } border ${
                      selectedAnswer === option ? 'border-accent-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-100">{option}</span>
                      {isAnswered && (
                        option === questions[currentQuestion].correctAnswer ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : option === selectedAnswer ? (
                          <XCircle className="text-red-500" size={20} />
                        ) : null
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}