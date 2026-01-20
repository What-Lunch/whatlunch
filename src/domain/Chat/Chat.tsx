'use client';

import { useEffect, useRef, useState } from 'react';
import { SendHorizontalIcon, UserIcon } from 'lucide-react';

import type { Socket } from 'socket.io-client';

import { createSocket } from '@/app/lib/socket';
import styles from './Chat.module.scss';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  isUser: boolean;
}

interface ChatProps {
  roomCode: string;
}

export default function Chat({ roomCode }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = createSocket(token);
    if (!socket) return;

    socketRef.current = socket;

    // 시스템 메시지
    socket.on('systemMessage', ({ message }) => {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: message,
          sender: 'system',
          isUser: false,
        },
      ]);
    });

    // 일반 메시지 수신
    socket.on('receiveMessage', ({ sender, message }) => {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: message,
          sender,
          isUser: false,
        },
      ]);
    });

    return () => {
      socket.off('systemMessage');
      socket.off('receiveMessage');
    };
  }, [roomCode]);

  // 메시지 전송
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const socket = socketRef.current;
    if (!socket) return;

    const myNickname = localStorage.getItem('nickname') ?? '나';

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: input,
        sender: myNickname,
        isUser: true,
      },
    ]);

    socket.emit('sendMessage', {
      roomCode,
      message: input,
    });

    setInput('');
  };

  return (
    <section className={styles['chat']}>
      <span className={styles['chat__title']}>실시간 채팅</span>
      <div className={styles['chat__content']}>
        {messages.length === 0 && (
          <div className={styles['chat__content__empty']}>
            아직 대화가 없어요. 메시지를 보내보세요!
          </div>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={
              message.isUser
                ? styles['chat__content__message-wrapper--user']
                : styles['chat__content__message-wrapper--bot']
            }
          >
            {!message.isUser && (
              <div className={styles['chat__content__profile']}>
                <UserIcon size={24} />
              </div>
            )}
            <div
              className={
                message.isUser
                  ? styles['chat__content__message--user']
                  : styles['chat__content__message--bot']
              }
            >
              {message.sender !== 'system' && (
                <div className={styles['chat__content__sender']}>{message.sender}</div>
              )}
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form className={styles['chat__input']} onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className={styles['chat__input__field']}
        />
        <button
          type="submit"
          aria-label="메시지 전송"
          className={styles['chat__input__send__icon']}
        >
          <SendHorizontalIcon size={20} />
        </button>
      </form>
    </section>
  );
}
