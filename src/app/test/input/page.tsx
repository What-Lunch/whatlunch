'use client';

import { useState } from 'react';
import React from 'react';

import BaseInput from '@/shared/components/Input/BaseInput';
import ErrorWrapper from '@/shared/components/Input/ErrorWrapper';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import SearchInput from '@/shared/components/Input/SearchInput';

const createChangeHandler = (setter: (value: string) => void) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
};

export default function InputTestPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [searchLog, setSearchLog] = useState<string[]>([]);

  const handleNicknameChange = createChangeHandler(setNickname);
  const handleEmailChange = createChangeHandler(setEmail);
  const handlePasswordChange = createChangeHandler(setPassword);
  const handleSearchChange = createChangeHandler(setSearch);

  const isNicknameError = nickname.length > 0 && nickname.length < 2;
  const isEmailError = email.length > 0 && !email.includes('@');
  const isPasswordError = password.length > 0 && password.length < 6;

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Input 디자인 확인</h1>

      {/* 일반 input - BaseInput 기반 Error 상태 검증 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>
          닉네임 input (타입 : text 및 ErrorWrapper 검증)
        </p>
        <ErrorWrapper isError={isNicknameError} errorMessage="닉네임은 최소 2자 이상이어야 합니다.">
          <BaseInput
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 2자 이상 입력하세요"
            name="nickname"
            id="nickname"
          />
        </ErrorWrapper>
      </section>

      {/* 이메일 Input (BaseInput 기반) */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>이메일 Input (타입 및 에러)</p>
        <ErrorWrapper isError={isEmailError} errorMessage="올바른 이메일 형식이 아닙니다.">
          <BaseInput
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일을 입력해 주세요"
          />
        </ErrorWrapper>
      </section>

      {/* 비밀번호 Input + Error 검증 (PasswordInput) */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>비밀번호 Input + Error</p>
        <ErrorWrapper isError={isPasswordError} errorMessage="6자 이상 입력해야 합니다.">
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            placeholder="6자 이상 입력"
          />
        </ErrorWrapper>
      </section>

      {/* 비활성화 (Disabled) 상태 검증 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>접근 불가능한 폼 input</p>
        <BaseInput
          type="text"
          value="disabled@example.com"
          onChange={() => {}}
          disabled={true}
          placeholder="비활성화됨"
        />
      </section>

      {/* 검색 Input (SearchInput 컴포넌트) - ErrorWrapper 없음 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>검색 Input - ErrorWrapper 없음</p>
        <p style={{ marginBottom: '8px', fontWeight: 300 }}>
          검색어 입력 후 Enter나 돋보기 버튼으로 로그 확인 가능/ x 클릭 시 지워짐
        </p>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
          onSearch={v => setSearchLog(prev => [v, ...prev])}
        />
      </section>

      {/* 검색 결과 로그 */}
      {searchLog.length > 0 && (
        <section>
          <p style={{ marginBottom: '8px', fontWeight: 600 }}>Search Log</p>
          <ul style={{ paddingLeft: '10px', color: '#ccc' }}>
            {searchLog.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
