import React from 'react';
import { Languages } from 'lucide-react';

interface LanguageProgressProps {
  userId: string | undefined;
}

export function LanguageProgress({ userId }: LanguageProgressProps) {
  return (
    <div className="bg-dark-200 rounded-lg p-6 border border-dark-300">
      <div className="flex items-center gap-3 mb-6">
        <Languages className="text-accent-400" size={24} />
        <h3 className="text-lg font-medium text-gray-200">Language Progress</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">Spanish</span>
            <span className="text-sm text-gray-400">75%</span>
          </div>
          <div className="w-full bg-dark-300 rounded-full h-2">
            <div
              className="bg-accent-500 h-2 rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-200">English</span>
            <span className="text-sm text-gray-400">60%</span>
          </div>
          <div className="w-full bg-dark-300 rounded-full h-2">
            <div
              className="bg-accent-500 h-2 rounded-full"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>

        <div className="pt-4 border-t border-dark-300">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Words Learned</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-dark-300 rounded-full text-sm text-gray-300">
              hola
            </span>
            <span className="px-2 py-1 bg-dark-300 rounded-full text-sm text-gray-300">
              gracias
            </span>
            <span className="px-2 py-1 bg-dark-300 rounded-full text-sm text-gray-300">
              por favor
            </span>
            {/* Add more words */}
          </div>
        </div>
      </div>
    </div>
  );
}