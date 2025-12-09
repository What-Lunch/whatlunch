'use client';

import { useState } from 'react';

import { FormInput, SearchInput } from '@/shared/components/Input';

export default function InputTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [searchLog, setSearchLog] = useState<string[]>([]);

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

      {/* email input */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>이메일 input</p>
        <FormInput
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="이메일을 입력해 주세요"
          isError={email.length > 0 && !email.includes('@')}
          errorMessage="올바른 이메일 형식이 아닙니다."
        />
      </section>

      {/* password input */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>비밀번호 input</p>
        <FormInput
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="비밀번호 입력"
          showToggle={true}
        />
      </section>

      {/* 비밀번호 에러 테스트 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>비밀번호 에러 테스트</p>
        <FormInput
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="6자 이상 입력"
          isError={password.length > 0 && password.length < 6}
          errorMessage="6자 이상 입력해야 합니다."
        />
      </section>

      {/* disabled 테스트 */}
      <section>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>접근 불가능한 폼 input</p>
        <FormInput
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
          onChange={setSearch}
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