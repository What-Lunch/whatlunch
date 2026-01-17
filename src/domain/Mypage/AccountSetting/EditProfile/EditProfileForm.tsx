'use client';

import { useEffect, useState } from 'react';

import BaseInput from '@/shared/components/Input/BaseInput/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput/PasswordInput';
import Button from '@/shared/components/Button/Button';

import { authService } from '@/app/services/Auth/auth.api';
import { useAuthStore } from '@/domain/Auth/store/auth.store';

import styles from './EditProfileForm.module.scss';

interface EditProfileFormProps {
  initialNickname: string; // 초기 닉네임
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

interface EditProfileFormState {
  nickname: string;
  newPassword: string;
  confirmPassword: string;
}

// 개인 정보 수정 폼
export default function EditProfileForm({
  initialNickname,
  onSubmitSuccess,
  onCancel,
}: EditProfileFormProps) {
  const setUser = useAuthStore(state => state.setUser);

  const [formState, setFormState] = useState<EditProfileFormState>({
    nickname: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 초기 닉네임 세팅 (모달 열릴 때 / 유저 변경 시)
  useEffect(() => {
    setFormState({
      nickname: initialNickname,
      newPassword: '',
      confirmPassword: '',
    });
  }, [initialNickname]);

  const isNicknameChanged = formState.nickname.trim() !== initialNickname;
  const isPasswordChanged = formState.newPassword.length > 0;

  const isSubmitDisabled = isSubmitting || (!isNicknameChanged && !isPasswordChanged);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const { nickname, newPassword, confirmPassword } = formState;

    if (!isNicknameChanged && !isPasswordChanged) {
      alert('변경된 정보가 없습니다');
      return;
    }

    if (isPasswordChanged && newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }

    if (isPasswordChanged && newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다');
      return;
    }

    // 서버에 보낼 변경된 값만
    const payload: {
      nickname?: string;
      password?: string;
    } = {};

    if (isNicknameChanged) {
      payload.nickname = nickname.trim();
    }

    if (isPasswordChanged) {
      payload.password = newPassword;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await authService.updateMe(payload);
      setUser(updatedUser);
      onSubmitSuccess();
    } catch {
      alert('정보 수정에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={styles['edit-profile']}
      onSubmit={e => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className={styles['edit-profile__body']}>
        <div className={styles['edit-profile__body-group']}>
          <label htmlFor="nickname" className={styles['edit-profile__body-group__label']}>
            닉네임
          </label>
          <BaseInput
            id="nickname"
            placeholder="변경할 닉네임"
            value={formState.nickname}
            onChange={e =>
              setFormState(prev => ({
                ...prev,
                nickname: e.target.value,
              }))
            }
          />
        </div>

        <div className={styles['edit-profile__body-group']}>
          <label htmlFor="newPassword" className={styles['edit-profile__body-group__label']}>
            새 비밀번호
          </label>
          <PasswordInput
            id="newPassword"
            placeholder="새 비밀번호 입력"
            value={formState.newPassword}
            onChange={e =>
              setFormState(prev => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            autoComplete="new-password"
          />
        </div>

        <div className={styles['edit-profile__body-group']}>
          <label htmlFor="confirmPassword" className={styles['edit-profile__body-group__label']}>
            비밀번호 확인
          </label>
          <PasswordInput
            id="confirmPassword"
            placeholder="비밀번호 다시 입력"
            value={formState.confirmPassword}
            onChange={e =>
              setFormState(prev => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className={styles['edit-profile__actions']}>
        <Button
          variant="blue"
          mode="outline"
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          취소
        </Button>

        <Button variant="blue" mode="fill" type="submit" disabled={isSubmitDisabled}>
          변경하기
        </Button>
      </div>
    </form>
  );
}
