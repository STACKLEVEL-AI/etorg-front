import React from 'react';
import { Menu, Bot } from 'lucide-react';
import type { Chat } from '@/types';

interface ChatHeaderProps {
  chat?: Chat;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onToggleSidebar,
  sidebarOpen,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
          sidebarOpen ? 'md:hidden' : ''
        }`}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">
            {chat?.title || 'AI Assistant'}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-500">Онлайн</p>
          </div>
        </div>
      </div>
    </header>
  );
};
