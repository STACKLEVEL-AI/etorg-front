import React from 'react';
import { User, Paperclip } from 'lucide-react';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
      <div
          className={`flex gap-4 p-6 border-b border-gray-100 hover:bg-gray-50/50 transition-colors
    ${isUser ? 'bg-gray-50/30 flex-row-reverse text-right' : 'bg-white'}
  `}
      >
        <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
      ${isUser ? 'bg-blue-500' : 'bg-emerald-500'}
    `}
        >
          {isUser ? (
              <User size={16} className="text-white"/>
          ) : (
              <div className="text-white text-xs font-bold">AI</div>
          )}
        </div>

        <div className={`flex-1 space-y-3 min-w-0 ${isUser ? 'items-end' : ''}`}>
          <div className={`flex items-center gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <span className="font-semibold text-sm text-gray-900">
        {isUser ? 'Вы' : 'AI Assistant'}
      </span>
            <span className="text-xs text-gray-500">
        {message.timestamp.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
          </div>

          {message.attachedFile && (
              <div
                  className={`flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-sm
          ${isUser ? 'flex-row-reverse ml-auto' : ''}
        `}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Paperclip size={16} className="text-blue-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blue-900 truncate">
                    {message.attachedFile.name}
                  </div>
                  <div className="text-xs text-blue-600">
                    {(message.attachedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
          )}

          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>

  );
};
