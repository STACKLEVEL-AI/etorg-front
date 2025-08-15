export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachedFile?: File;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
