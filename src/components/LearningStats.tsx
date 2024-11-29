import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

interface LearningStatsProps {
  userId: string | undefined;
}

export function LearningStats({ userId }: LearningStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('quiz_stats')
        .eq('id', userId)
        .single();

      if (profile?.quiz_stats) {
        setStats(profile.quiz_stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-200 rounded-lg p-6 border border-dark-300 animate-pulse">
        <div className="h-40"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-200 rounded-lg p-6 border border-dark-300">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-accent-400" size={24} />
        <h3 className="text-lg font-medium text-gray-200">Learning Stats</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-accent-400" size={20} />
            <span className="text-sm text-gray-400">Total Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-100">
            {stats?.correct_answers || 0}/{stats?.total_quizzes || 0}
          </p>
        </div>

        <div className="bg-dark-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-accent-400" size={20} />
            <span className="text-sm text-gray-400">Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-100">
            {stats?.streak_days || 0} days
          </p>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={[
              { name: 'Mon', score: 4 },
              { name: 'Tue', score: 3 },
              { name: 'Wed', score: 5 },
              { name: 'Thu', score: 7 },
              { name: 'Fri', score: 6 },
              { name: 'Sat', score: 8 },
              { name: 'Sun', score: 9 },
            ]}
          >
            <XAxis dataKey="name" stroke="#9698ac" />
            <YAxis stroke="#9698ac" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2a2b38',
                border: '1px solid #363745',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}