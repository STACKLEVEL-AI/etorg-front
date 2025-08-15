import React from 'react';
import { X, Plus, MessageSquare, Trash2 } from 'lucide-react';
import type { Chat } from '@/types';
import { pluralizeMessages } from '@/utils/pluralize.ts';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 w-80 flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-300 to-green-600 rounded-lg flex items-center justify-center">
                <MessageSquare size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold">Евроторг AI</h1>
            </div>
            <button
              onClick={onToggle}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
          >
            <Plus size={18} />
            Новый чат
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto py-2">
          {chats.map((chat) => (
            <div key={chat.id} className="group relative mx-2 mb-1">
              <button
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                  currentChatId === chat.id
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">
                    {chat.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {pluralizeMessages(chat.messages.length)} •{' '}
                    {chat.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded-md transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {chats.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Пока нет чатов</p>
              <p className="text-xs mt-1">Создайте первый чат</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            AI Chat Assistant v1.0
          </div>
        </div>
      </div>
    </>
  );
};
