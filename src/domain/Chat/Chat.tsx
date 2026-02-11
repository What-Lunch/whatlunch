'use client';

import { useEffect, useRef, useState } from 'react';
import { SendHorizontalIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';

import type { Socket } from 'socket.io-client';

import { getSocket } from '@/app/lib/socket';
import styles from './Chat.module.scss';

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  profileImage?: string | null;
  isUser: boolean;
  isSystem?: boolean; // 시스템 메시지 여부
}

interface ChatProps {
  roomCode: string;
}

export default function Chat({ roomCode }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socketRef.current = socket;

    const joinRoom = () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;
      socket.emit('joinRoom', { roomCode });
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once('connect', joinRoom);
    }

    // 시스템 메시지
    socket.on('systemMessage', ({ message }) => {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: message,
          sender: 'system',
          isUser: false,
          isSystem: true,
        },
      ]);
    });

    // 일반 메시지 수신
    socket.on('messageReceived', payload => {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: payload.message,
          sender: payload.userName,
          profileImage: payload.profileImage,
          isUser: false,
        },
      ]);
    });

    return () => {
      socket.off('systemMessage');
      socket.off('messageReceived');
    };
  }, [roomCode]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <section className={styles['chat']}>
      <span className={styles['chat__title']}>실시간 채팅</span>
      <div className={styles['chat__content']} ref={contentRef}>
        {messages.length === 0 && (
          <div className={styles['chat__content__empty']}>
            아직 대화가 없어요. 메시지를 보내보세요!
          </div>
        )}
        {messages.map(message => {
          if (message.isSystem) {
            return (
              <div key={message.id} className={styles['chat__content__message-wrapper--system']}>
                <div className={styles['chat__content__system-banner']}>{message.text}</div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={
                message.isUser
                  ? styles['chat__content__message-wrapper--user']
                  : styles['chat__content__message-wrapper--other']
              }
            >
              {!message.isUser && (
                <div className={styles['chat__content__profile']}>
                  {message.profileImage ? (
                    <Image
                      src={message.profileImage}
                      alt={message.sender}
                      width={32}
                      height={32}
                      className={styles['chat__content__profile-image']}
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
              )}

              <div className={styles['chat__content__bubble-group']}>
                {!message.isUser && (
                  <div className={styles['chat__content__nickname']}>{message.sender}</div>
                )}

                <div
                  className={
                    message.isUser
                      ? styles['chat__content__message--user']
                      : styles['chat__content__message--other']
                  }
                >
                  {message.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form className={styles['chat__input']} onSubmit={onSubmit}>
        <textarea
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className={styles['chat__input__field']}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.nativeEvent.isComposing) return;

            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
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
