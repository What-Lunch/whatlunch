'use client';

import { useState } from 'react';
import { UserIcon, MailIcon, SettingsIcon, LogOutIcon, ChevronRightIcon } from 'lucide-react';

import EditProfileModal from '../AccountSetting/EditProfile/EditProfileModal';
import LogoutModal from '../AccountSetting/LogoutModal/LogoutModal';

import { useAuthStore } from '@/domain/Auth/store/auth.store';

import styles from './AccountSetting.module.scss';

// 활성화된 모달 타입
type AccountSettingActiveModal = 'edit-profile' | 'logout' | null;

// 메뉴 아이템 타입
interface AccountSettingMenuItem {
  key: 'email' | 'edit-profile' | 'logout';
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function AccountSetting() {
  const [activeModal, setActiveModal] = useState<AccountSettingActiveModal>(null);

  const user = useAuthStore(state => state.user);

  const settingMenus: AccountSettingMenuItem[] = [
    {
      key: 'email',
      icon: <MailIcon size={18} />,
      title: '이메일',
      description: user?.email ?? 'example@gmail.com',
      disabled: true,
    },
    {
      key: 'edit-profile',
      icon: <SettingsIcon size={18} />,
      title: '개인 정보 수정',
      description: '프로필 및 개인정보 변경',
      onClick: () => setActiveModal('edit-profile'),
    },
    {
      key: 'logout',
      icon: <LogOutIcon size={18} />,
      title: '로그아웃',
      description: '계정에서 로그아웃하기',
      onClick: () => setActiveModal('logout'),
    },
  ];

  return (
    <>
      <section className={styles['account-setting']}>
        <header className={styles['account-setting__header']}>
          <h2 className={styles['account-setting__header__title']}>계정 설정</h2>
          <UserIcon className={styles['account-setting__header__icon']} />
        </header>

        <div className={styles['account-setting__menu']}>
          {settingMenus.map(menu => {
            const isClickable = Boolean(menu.onClick) && !menu.disabled;

            return (
              <div
                key={menu.key}
                className={[
                  styles['account-setting__menu__section'],
                  menu.key === 'logout' ? styles['account-setting__menu__section--logout'] : '',
                  menu.disabled ? styles['is-disabled'] : isClickable ? styles['is-clickable'] : '',
                ].join(' ')}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : -1}
                aria-disabled={!isClickable}
                onClick={menu.onClick}
                onKeyDown={e => {
                  if (!isClickable) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    menu.onClick?.();
                  }
                }}
              >
                <div className={styles['account-setting__menu__section__info']}>
                  <span className={styles['account-setting__menu__section__info__icon']}>
                    {menu.icon}
                  </span>

                  <div>
                    <div className={styles['account-setting__menu__section__info__title']}>
                      {menu.title}
                    </div>
                    <div className={styles['account-setting__menu__section__info__description']}>
                      {menu.description}
                    </div>
                  </div>
                </div>

                {isClickable && (
                  <ChevronRightIcon className={styles['account-setting__menu__section__chevron']} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <EditProfileModal
        isOpen={activeModal === 'edit-profile'}
        onClose={() => setActiveModal(null)}
      />

      <LogoutModal isOpen={activeModal === 'logout'} onClose={() => setActiveModal(null)} />
    </>
  );
}
