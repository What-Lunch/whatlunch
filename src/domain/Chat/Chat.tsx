import { SendHorizontalIcon, UserIcon } from 'lucide-react';

import { mockChat } from './mock';
import styles from './Chat.module.scss';

/**
 * TODO
 * 채팅 기능 구현 필요 (백엔드 + submit)
 * 채팅 로딩 UI 구현 필요 (스켈레톤 또는 로딩 스피너)
 */
export default function Chat() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <section className={styles['chat']}>
      <span className={styles['chat__title']}>실시간 채팅</span>
      <div className={styles['chat__content']}>
        {mockChat.messages.length === 0 && (
          <div className={styles['chat__content__empty']}>
            아직 대화가 없어요. 메시지를 보내보세요!
          </div>
        )}
        {mockChat.messages.map(message => (
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
                {/* TODO: 현재 아이콘으로 대체함, 프로필 이미지로 대체 필요 */}
                <UserIcon className={styles['chat__content__profile__image']} size={24} />
              </div>
            )}
            <div
              className={
                message.isUser
                  ? styles['chat__content__message--user']
                  : styles['chat__content__message--bot']
              }
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form className={styles['chat__input']} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className={styles['chat__input__field']}
        />
        <button type="submit" className={styles['chat__input__send']} aria-label="send message">
          <SendHorizontalIcon className={styles['chat__input__send__icon']} size={20} />
        </button>
      </form>
    </section>
  );
}
