'use client';

import { useState } from 'react';
import KakaoMap from '@/shared/components/KakaoMap';

export default function KakaoMapPage() {
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  console.log(value);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(value);
  };
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search location"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>
      <KakaoMap value={search} />
    </div>
  );
}
