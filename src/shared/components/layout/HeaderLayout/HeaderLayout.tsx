'use client';
import { useState } from 'react';

import Header from './Header';
import LoginModal from '@/domain/Auth/LoginModal';
import SignupModal from '@/domain/Auth/SignupModal';

export default function HeaderLayout() {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

  return (
    <header>
      <Header onLogin={() => setModalType('login')} onSignup={() => setModalType('signup')} />
      {modalType === 'login' && (
        <LoginModal
          onClose={() => setModalType(null)}
          onSignupOpen={() => setModalType('signup')}
        />
      )}
      {modalType === 'signup' && (
        <SignupModal onClose={() => setModalType(null)} onLoginOpen={() => setModalType('login')} />
      )}
    </header>
  );
}
