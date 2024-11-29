import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function PublicChatWarning() {
  const user = useAuthStore(state => state.user);

  return (
    <div className="p-4 border-b border-dark-300">
      <div className="text-sm">
        <div className="mb-3">
          <h3 className="font-medium text-yellow-400 flex items-center gap-2">
            <AlertTriangle size={16} />
            Public Chat Room
          </h3>
          <p className="mt-1 text-gray-300">
            This is a public space where messages are visible to everyone.
            The chat resets daily at midnight.
          </p>
          {!user && (
            <p className="mt-2">
              <Link to="/auth" className="text-accent-400 hover:text-accent-300 font-medium">
                Sign in
              </Link>
              {' '}to use your name and have private conversations.
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-dark-400">
          <h3 className="font-medium text-yellow-400 flex items-center gap-2">
            <AlertTriangle size={16} />
            Sala de Chat Pública
          </h3>
          <p className="mt-1 text-gray-300">
            Este es un espacio público donde los mensajes son visibles para todos.
            El chat se reinicia diariamente a medianoche.
          </p>
          {!user && (
            <p className="mt-2">
              <Link to="/auth" className="text-accent-400 hover:text-accent-300 font-medium">
                Inicia sesión
              </Link>
              {' '}para usar tu nombre y tener conversaciones privadas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}