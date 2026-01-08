import { CircleQuestionMarkIcon, MessageCircleIcon, ChevronRightIcon } from 'lucide-react';

import styles from './MypageFaq.module.scss';
import Button from '@/shared/components/Button/Button';

export default function MypageFaq() {
  const faqMenus = [
    {
      icon: <CircleQuestionMarkIcon size={18} />,
      title: '자주 묻는 질문',
      description: 'FAQ에서 답변을 찾아보세요',
    },
    {
      icon: <MessageCircleIcon size={18} />,
      title: '문의하기',
      description: '1:1 문의 및 피드백 보내기',
    },
  ];

  return (
    <section className={styles['mypage-faq']}>
      <header className={styles['mypage-faq__header']}>
        <h2 className={styles['mypage-faq__header__title']}>고객 지원</h2>
        <CircleQuestionMarkIcon className={styles['mypage-faq__header__icon']} />
      </header>
      <div className={styles['mypage-faq__menu']}>
        {faqMenus.map(menu => (
          <div className={styles['mypage-faq__menu__section']} key={menu.title + menu.description}>
            <div className={styles['mypage-faq__menu__section__info']}>
              <span className={styles['mypage-faq__menu__section__info__icon']}>{menu.icon}</span>
              <div>
                <div className={styles['mypage-faq__menu__section__info__title']}>{menu.title}</div>
                <div className={styles['mypage-faq__menu__section__info__description']}>
                  {menu.description}
                </div>
              </div>
            </div>

            <ChevronRightIcon className={styles['mypage-faq__menu__section__chevron']} />
          </div>
        ))}
        <div className={styles['mypage-faq__help']}>
          <MessageCircleIcon className={styles['mypage-faq__help__icon']} />
          <div className={styles['mypage-faq__help__content']}>
            <div className={styles['mypage-faq__help__content__text']}>
              <div className={styles['mypage-faq__help__content__text__title']}>
                도움이 필요하신가요?
              </div>
              <div className={styles['mypage-faq__help__content__text__description']}>
                메뉴 선택이나 서비스 이용에 어려움이 있으시면 언제든지 문의해주세요.
              </div>
            </div>
            <Button variant="blue">지금 문의하기</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
