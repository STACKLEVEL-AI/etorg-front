import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { MessageInput } from '@/components/MessageInput';
import { EmptyState } from '@/components/EmptyState';
import { ChatHeader } from '@/components/ChatHeader';
import type { Chat, Message } from '@/types';


export const App = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      // Преобразуем `createdAt` чата и `timestamp` каждого сообщения
      return parsedChats.map((chat: Chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map(message => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      }));
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    const savedChatId = localStorage.getItem('currentChatId');
    const savedChats = localStorage.getItem('chats');
    const chats = savedChats ? JSON.parse(savedChats) : [];
    // Проверяем, существует ли сохраненный чат с таким ID
    if (savedChatId && chats.some(chat => chat.id === savedChatId)) {
      return savedChatId;
    }
    // Если нет, возвращаем null
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  useEffect(() => {
    // Пинг бекенда при загрузке приложения
    fetch("https://etorg-back.onrender.com/health")
        .then((res) => {
          if (!res.ok) throw new Error("Backend not reachable");
          return res.json();
        })
        .then((data) => {
          console.log("Backend is up:", data);
        })
        .catch((err) => {
          console.error("Error pinging backend:", err);
        });
  }, []);

  // useEffect для сохранения чатов
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // useEffect для сохранения ID текущего чата
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }, [currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Функция для извлечения текста из файла
  const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result as string;
        resolve(text);
      };

      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'));
      };

      if (file.type === 'text/plain' || file.type === 'text/csv' ||
          file.type === 'application/json' || file.name.endsWith('.txt') ||
          file.name.endsWith('.csv') || file.name.endsWith('.json')) {
        reader.readAsText(file, 'UTF-8');
      } else {
        reject(new Error('Поддерживаются только текстовые файлы (.txt, .csv, .json)'));
      }
    });
  };

  // Функция для отправки запроса к бэкенду
  const sendToBackend = async (question: string): Promise<string> => {
    try {
      const response = await fetch('https://etorg-back.onrender.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.answer;
    } catch (error) {
      console.error('Ошибка при обращении к бэкенду:', error);
      throw new Error('Не удалось получить ответ от сервера. Проверьте подключение.');
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Новый чат',
      messages: [],
      createdAt: new Date(),
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const sendMessage = async (content: string, file?: File) => {
    if ((!content.trim() && !file) || isLoading) return;

    let chatId = currentChatId;

    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.trim().slice(0, 50) || 'Новый чат',
        messages: [],
        createdAt: new Date(),
      };
      setChats((prev) => [newChat, ...prev]);
      chatId = newChat.id;
      setCurrentChatId(chatId);
    }

    let finalMessage = content.trim();
    let fileContent = '';

    if (file) {
      try {
        fileContent = await extractTextFromFile(file);
        finalMessage = `${finalMessage}\n\nДополнительный документ:\n${fileContent}`;
      } catch (error) {
        console.error('Ошибка при обработке файла:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: `Ошибка при обработке файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
          sender: 'assistant',
          timestamp: new Date(),
        };

        setChats((prev) =>
            prev.map((chat) =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, errorMessage] }
                    : chat
            )
        );
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim() || (file ? `Прикреплен файл: ${file.name}` : ''),
      sender: 'user',
      timestamp: new Date(),
      attachedFile: file,
    };

    setChats((prev) =>
        prev.map((chat) =>
            chat.id === chatId
                ? {
                  ...chat,
                  messages: [...chat.messages, userMessage],
                  title:
                      chat.messages.length === 0
                          ? content.trim().slice(0, 50) || 'Новый чат'
                          : chat.title,
                }
                : chat
        )
    );

    setIsLoading(true);

    let fullContext = '';

    const chatHistory = chats.find(chat => chat.id === chatId)?.messages || [];
    if (chatHistory.length > 0) {
      fullContext += 'История чата:\n';
      chatHistory.forEach(msg => {
        const sender = msg.sender === 'user' ? 'Пользователь' : 'AI Assistant';
        fullContext += `${sender}: ${msg.content}\n`;
      });
      fullContext += '---\n';
    }

    fullContext += 'Текущий вопрос:\n';
    fullContext += `Пользователь: ${finalMessage || `Обработай прикрепленный файл: ${file?.name}`}\n`;

    try {
      const aiResponse = await sendToBackend(fullContext);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setChats((prev) =>
          prev.map((chat) =>
              chat.id === chatId
                  ? { ...chat, messages: [...chat.messages, assistantMessage] }
                  : chat
          )
      );
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : 'Произошла ошибка при обработке запроса',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setChats((prev) =>
          prev.map((chat) =>
              chat.id === chatId
                  ? { ...chat, messages: [...chat.messages, errorMessage] }
                  : chat
          )
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={selectChat}
            onNewChat={createNewChat}
            onDeleteChat={deleteChat}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div
            className={`flex-1 flex flex-col  max-w-full transition-all duration-300 ${
                sidebarOpen ? 'ml-0' : 'ml-0'
            }`}
        >
          <ChatHeader
              chat={currentChat}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
          />

          <div className="flex-1 overflow-y-auto bg-white">
            {!currentChat || currentChat.messages.length === 0 ? (
                <EmptyState onQuestionClick={sendMessage}/>
            ) : (
                <div className="w-full mx-auto">
                  {currentChat.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                  ))}

                  {isLoading && (
                      <div className="flex gap-4 p-6 border-b border-gray-100 hover:bg-gray-50/50">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                          <div className="w-4 h-4 text-white font-semibold text-xs">
                            AI
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-700">
                        AI Assistant
                      </span>
                            <span className="text-xs text-gray-500">печатает...</span>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white">
            <div className="w-full mx-auto">
              <MessageInput onSendMessage={sendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
  );
};