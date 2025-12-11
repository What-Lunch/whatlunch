'use client';

import { useState } from 'react';

import FormField from '@/shared/components/Input/FormField'; 
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

      {/* 닉네임 input (Type='text' 및 에러 지원 검증) */}
       <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>닉네임 input (타입 : text)</p>
        <FormField
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임을 2자 이상 입력하세요"
          isError={isNicknameError}
          errorMessage="닉네임은 최소 2자 이상이어야 합니다."
        />
      </section>

      {/* email input */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>이메일 input</p>
        <FormField
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="이메일을 입력해 주세요"
          isError={email.length > 0 && !email.includes('@')}
          errorMessage="올바른 이메일 형식이 아닙니다."
        />
      </section>

      {/* password input */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>비밀번호 input</p>
        <FormField
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호 입력"
          showToggle={true}
        />
      </section>

      {/* password error 테스트 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>비밀번호 에러 테스트</p>
        <FormField
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="6자 이상 입력"
          isError={password.length > 0 && password.length < 6}
          errorMessage="6자 이상 입력해야 합니다."
        />
      </section>

      {/* disabled 테스트 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>접근 불가능한 폼 input</p>
        <FormField
          type="email"
          value="disabled@example.com"
          onChange={() => {}}
          disabled={true}
          placeholder="비활성화됨"
        />
      </section>

      {/* search input */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>검색 input</p>
        <p style={{ marginBottom: '8px', fontWeight: 300 }}>검색어 입력 후 Enter나 돋보기 버튼으로 로그 확인 가능/ x 클릭 시 지워짐</p>
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
          onSearch={(v) => setSearchLog((prev) => [v, ...prev])}
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