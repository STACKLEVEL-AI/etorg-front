import React from 'react';
import Logo from '../assets/logo.png'

// Добавляем пропс onQuestionClick
export const EmptyState: React.FC<{ onQuestionClick: (question: string) => void }> = ({ onQuestionClick }) => {
  // Список вопросов
  const questions = [
    'Расскажи про основные моменты сотрудничества с перевозчиками в Евроторг?',
    'Опиши текущую ситуацию компании, ключевые риски и рекомендации по развитию.',
    'Подготовь список из 10 типичных вопросов от кассира и готовых коротких ответов (регламенты, возвраты, дисконтные карты).',
    'Поставщик задерживает поставку — что делать?',
    'Проверь мои знания и составь вопросы по стандартам выкладки.',
    'Номер телефона службы поддержки ИТ?',
    'Я новый менеджер магазина. С чего начать в первую неделю?',
    'Сформулируй «elevator pitch» о миссии и ценностях «Евроторга» для новых сотрудников (одно‑две короткие фразы).',
    'Наблюдаем резкое падение трафика и среднего чека в регионе: какие оперативные шаги для диагностики и первые гипотезы?',
    'На почте банка задержка платежа: какие альтернативные способы оплаты и какие контактные данные банковских реквизитов мы должны предоставить?',
    'Требуется срочно оценить влияние девальвации валюты на ~42% задолженности в инвалюте — какие данные запросить и как быстро посчитать примерную чувствительность к курсу?',
    'Придумай три стандартных ответа сотрудника магазина на вопрос клиента «почему я должен выбрать Евроопт?» с опорой на наши форматы и преимущества'
  ];

  return (
      <div className="flex-1 overflow-y-auto pt-0">
        <div className="flex items-center justify-center h-full text-center">
          <div className="mx-auto p-6">
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src={Logo} size={24}/>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Добро пожаловать в Евроторг AI Chat
            </h3>
            <p className="text-slate-600 mb-4">
              Я — ИИ-ассистент Евроторга, чтобы работа шла быстрее и проще. Найти документ? Разобраться с процессом?
              Подсказать инструкции? Легко!
            </p>
            <p className="text-slate-600 mb-4">
              Давайте начнём — что ищем сегодня?
            </p>
            {/*<div className="flex flex-col items-center gap-4 text-sm text-slate-500 mb-8">*/}
            {/*  <div className="flex items-center gap-1">*/}
            {/*    <Upload size={16}/>*/}
            {/*    Загрузка файлов*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-1">*/}
            {/*    <MessageSquare size={16}/>*/}
            {/*    Умные ответы*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* Новый блок с вопросами */}
            <div className="text-left w-full mt-6">
              <p className="text-slate-800 font-medium mb-2">Начните с примера:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {questions.map((q, index) => (
                    <button
                        key={index}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200 text-sm p-3 rounded-lg text-left w-full"
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