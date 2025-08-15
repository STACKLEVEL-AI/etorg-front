import React from 'react';
import { Upload, MessageSquare } from 'lucide-react';

// Добавляем пропс onQuestionClick
export const EmptyState: React.FC<{ onQuestionClick: (question: string) => void }> = ({ onQuestionClick }) => {
  // Список вопросов
  const questions = [
    'Как создать новый компонент в React?',
    'Объясни, что такое хуки в React.',
    'Сравни useState и useReducer.',
    'Как оптимизировать производительность React-приложения?'
  ];

  return (
      <div className="flex-1 overflow-y-auto pt-0">
        <div className="flex items-center justify-center h-full text-center">
          <div className="max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Добро пожаловать в AI Chat
            </h3>
            <p className="text-slate-600 mb-4">
              Начните разговор, задайте вопрос или прикрепите файл для анализа
            </p>
            <div className="flex flex-col items-center gap-4 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-1">
                <Upload size={16} />
                Загрузка файлов
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={16} />
                Умные ответы
              </div>
            </div>

            {/* Новый блок с вопросами */}
            <div className="text-left w-full mt-6">
              <p className="text-slate-800 font-medium mb-2">Начните с примера:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {questions.map((q, index) => (
                    <button
                        key={index}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200 text-sm p-3 rounded-lg text-left"
                        onClick={() => onQuestionClick(q)}
                    >
                      {q}
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};