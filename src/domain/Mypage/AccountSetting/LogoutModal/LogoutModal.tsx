'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Modal from '@/shared/components/Modal/Modal';
import Button from '@/shared/components/Button/Button';

import { authService } from '@/app/services/backend/auth.api';
import { useAuthStore } from '@/domain/Auth/store/auth.store';

import styles from './LogoutModal.module.scss';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  const clearUser = useAuthStore(state => state.clearUser);

  if (!isOpen) return null;

  const handleLogout = () => {
    authService.postLogout();
    clearUser();
    onClose();

    // 로그아웃 성공 토스트 메시지 띄우기
    toast.success('로그아웃 되었습니다.', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
    });
    router.replace('/');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="로그아웃"
      description="정말 로그아웃하시겠어요?"
      innerClassName={styles['logout-modal']}
    >
      <div className={styles['logout-modal__actions']}>
        <Button variant="neutral" mode="outline" type="button" onClick={onClose}>
          취소
        </Button>

        <Button variant="danger" mode="fill" type="button" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </Modal>
  );
}
