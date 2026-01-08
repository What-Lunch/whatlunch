import { UserIcon, MailIcon, SettingsIcon, LogOutIcon, ChevronRightIcon } from 'lucide-react';
import styles from './AccountSetting.module.scss';

export default function AccountSetting() {
  const settingMenus = [
    {
      icon: <MailIcon size={18} />,
      title: '이메일',
      description: 'example@example.com',
    },
    {
      icon: <SettingsIcon size={18} />,
      title: '개인 정보 수정',
      description: '프로필 및 개인정보 변경',
    },
    {
      icon: <LogOutIcon size={18} color="red" />,
      title: '로그아웃',
      description: '계정에서 로그아웃하기',
    },
  ];

  return (
    <section className={styles['account-setting']}>
      <header className={styles['account-setting__header']}>
        <h2 className={styles['account-setting__header__title']}>자주 선택된 메뉴 요약</h2>
        <UserIcon className={styles['account-setting__header__icon']} />
      </header>
      <div className={styles['account-setting__menu']}>
        {settingMenus.map(menu => (
          <div
            className={styles['account-setting__menu__section']}
            key={menu.title + menu.description}
          >
            <div className={styles['account-setting__menu__section__info']}>
              <span className={styles['account-setting__menu__section__info__icon']}>
                {menu.icon}
              </span>
              <div>
                <div className={styles['account-setting__menu__section__info__title']}>
                  {menu.title}
                </div>
                <div className={styles['account-setting__menu__section__info__desc']}>
                  {menu.description}
                </div>
              </div>
            </div>
            <ChevronRightIcon className={styles['account-setting__menu__section__chevron']} />
          </div>
        ))}
      </div>
    </section>
  );
}
