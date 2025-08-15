import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!inputMessage.trim() && !selectedFile) || disabled) return;

    onSendMessage(inputMessage, selectedFile || undefined);
    setInputMessage('');
    setSelectedFile(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="p-6">
      {selectedFile && (
        <div className="mb-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-sm">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Paperclip size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-blue-900 truncate">
                {selectedFile.name}
              </div>
              <div className="text-xs text-blue-600">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-blue-200 rounded-md transition-colors"
            >
              <X size={14} className="text-blue-600" />
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".txt,.pdf,.doc,.docx,.json,.csv,.png,.jpg,.jpeg,.gif,.webp"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-3 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Прикрепить файл"
        >
          <Paperclip size={20} />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyPress}
            placeholder="Введите сообщение..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={disabled}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={(!inputMessage.trim() && !selectedFile) || disabled}
          className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
        >
          <Send size={20} color="black" />
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Нажмите{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
          Enter
        </kbd>{' '}
        для отправки,
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs ml-1">
          Shift+Enter
        </kbd>{' '}
        для новой строки
      </div>
    </div>
  );
};
