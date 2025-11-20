'use client';

import { useState } from 'react';
import Input from '@/components/common/input/Input';

export default function InputTestPage() {
  const [value, setValue] = useState('');
  const [errorValue, setErrorValue] = useState('');
  const [iconValue, setIconValue] = useState('');

  return (
    <main style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Input 컴포넌트 테스트 페이지</h1>

      {/* 기본 */}
      <section style={{ marginTop: '24px' }}>
        <h2>기본(Default)</h2>
        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="기본 Input" />
      </section>

      {/* 에러 */}
      <section style={{ marginTop: '24px' }}>
        <h2>에러 상태(Error)</h2>
        <Input
          value={errorValue}
          onChange={e => setErrorValue(e.target.value)}
          isError={true} // false시, 초록색 테두리 & 문구 뜨지 않음
          errorMessage="오류가 발생했습니다."
          placeholder="에러 Input"
        />
      </section>

      {/* Disabled */}
      <section style={{ marginTop: '24px' }}>
        <h2>비활성화(Disabled)</h2>
        <Input value="" onChange={() => {}} disabled placeholder="test@test.com" />
      </section>

      {/* Left Icon */}
      <section style={{ marginTop: '24px' }}>
        <h2>Left Icon</h2>
        <Input
          value={iconValue}
          onChange={e => setIconValue(e.target.value)}
          leftIcon={<span>🔍</span>}
          placeholder="왼쪽 아이콘"
        />
      </section>

      {/* Right Icon */}
      <section style={{ marginTop: '24px' }}>
        <h2>Right Icon</h2>
        <Input
          value={iconValue}
          onChange={e => setIconValue(e.target.value)}
          rightIcon={<span>❌</span>}
          placeholder="오른쪽 아이콘"
        />
      </section>

      {/* Right Icon + onClick */}
      <section style={{ marginTop: '24px' }}>
        <h2>Right Icon + Clickable</h2>
        <Input
          value={iconValue}
          onChange={e => setIconValue(e.target.value)}
          rightIcon={<span>🗑️</span>}
          onRightIconClick={() => alert('아이콘 클릭됨!')}
          placeholder="클릭 가능한 아이콘"
        />
      </section>

      {/* Password type */}
      <section style={{ marginTop: '24px' }}>
        <h2>Password Input</h2>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          type="password"
          placeholder="비밀번호 입력"
        />
      </section>
    </main>
  );
}
