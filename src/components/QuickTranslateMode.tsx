import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, RotateCcw, Languages, X } from 'lucide-react';
import { detectAndTranslate } from '../utils/translator';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickTranslateModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTranslateMode({ isOpen, onClose }: QuickTranslateModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Failed to recognize speech. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      setTranscript('');
      setTranslation('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleTranslate = async () => {
    if (!transcript.trim()) return;

    try {
      setIsTranslating(true);
      setError(null);
      const result = await detectAndTranslate(transcript);
      setTranslation(result.translation);

      // Text-to-speech for translation
      const utterance = new SpeechSynthesisUtterance(result.translation);
      utterance.lang = result.detectedLanguage === 'es' ? 'en-US' : 'es-ES';
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const resetAll = () => {
    setTranscript('');
    setTranslation('');
    setError(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-dark-100 z-50 md:p-4"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-dark-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="text-accent-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-100">Quick Translate Mode</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-200 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Original Text */}
          <div className="flex-1 bg-dark-200 rounded-lg p-4 relative">
            <p className="text-sm text-gray-400 mb-2">Original:</p>
            <p className="text-lg text-gray-100">{transcript || 'Speak to translate...'}</p>
            
            {isListening && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-accent-400">
                <span className="animate-pulse">●</span>
                <span className="text-sm">Listening...</span>
              </div>
            )}
          </div>

          {/* Translation */}
          <div className="flex-1 bg-dark-200 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Translation:</p>
            <p className="text-lg text-gray-100">
              {isTranslating ? 'Translating...' : translation || 'Translation will appear here...'}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-dark-50 p-4 grid grid-cols-3 gap-4">
          <button
            onClick={toggleListening}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-accent-600 text-white'
            } transition-colors`}
          >
            <Mic size={24} />
            <span>{isListening ? 'Stop' : 'Start'}</span>
          </button>

          <button
            onClick={handleTranslate}
            disabled={!transcript || isTranslating}
            className="flex-1 flex items-center justify-center gap-2 p-4 bg-dark-300 text-gray-100 rounded-lg disabled:opacity-50"
          >
            <Volume2 size={24} />
            <span>Speak</span>
          </button>

          <button
            onClick={resetAll}
            className="flex-1 flex items-center justify-center gap-2 p-4 bg-dark-300 text-gray-100 rounded-lg"
          >
            <RotateCcw size={24} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}