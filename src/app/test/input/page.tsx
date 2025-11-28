'use client';

import { useState } from 'react';
import Input from '@/components/common/input/Input';

export default function InputTestPage() {
  const [normalValue, setNormalValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [pwd, setPwd] = useState('');
  const [disabledValue] = useState('비활성 상태');

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Input 디자인 확인</h1>

      {/* 기본 입력 */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 500 }}>기본 입력</p>
        <Input
          value={normalValue}
          onChange={e => setNormalValue(e.target.value)}
          placeholder="입력해보세요"
        />
      </div>

      {/* 오류 입력 */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 500 }}>오류 상태 테스트</p>
        <Input
          value={errorValue}
          onChange={e => setErrorValue(e.target.value)}
          placeholder="잘못 입력해보세요"
          isError={errorValue.length > 0 && errorValue.length < 4}
          errorMessage="4글자 이상 입력해야 합니다."
        />
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 500 }}>Password 입력</p>
        <Input
          type="password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder="비밀번호 입력"
        />
      </div>

      {/* 비활성화 - ex. 회원정보나 프로필 화면에서 수정 불가능한 항목(이메일, 가입일) */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 500 }}>비활성 상태</p>
        <Input value={disabledValue} onChange={() => {}} disabled />
      </div>
    </div>
  );
}
