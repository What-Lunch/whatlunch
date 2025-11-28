import styles from './MapPanel.module.scss';

const CATEGORIES = [
  { code: 'FD6', label: '음식점' },
  { code: 'CE7', label: '카페' },
  { code: 'CS2', label: '편의점' },
  { code: 'MT1', label: '마트' },
  { code: 'AD5', label: '숙박' },
];

export interface MapPanelProps {
  keyword: string;
  setKeyword: (v: string) => void;
  onKeywordSearch: () => void;
  onCategoryClick: (code: string) => void;
  onReset: () => void;
}

export default function MapPanel({
  keyword,
  setKeyword,
  onKeywordSearch,
  onCategoryClick,
  onReset,
}: MapPanelProps) {
  return (
    <div className={styles['panel']}>
      <div className={styles['panel__search']}>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onKeywordSearch()}
          placeholder="검색 (예: 라멘, 파스타)"
        />
        <button onClick={onKeywordSearch}>검색</button>
      </div>

      <div className={styles['panel__categories']}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.code}
            className={styles['panel__category']}
            onClick={() => onCategoryClick(cat.code)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button className={styles['panel__reset']} onClick={onReset}>
        초기화
      </button>
    </div>
  );
}
