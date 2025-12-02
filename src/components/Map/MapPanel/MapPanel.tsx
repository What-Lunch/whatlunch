import Button from '@/components/common/Button/Button';

import { MapPanelProps, CATEGORIES } from './type';

import styles from './MapPanel.module.scss';

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

        <Button variant="primary" mode="fill" onClick={onKeywordSearch}>
          검색
        </Button>
      </div>

      <div className={styles['panel__categories']}>
        {CATEGORIES.map(cat => (
          <Button
            key={cat.code}
            variant="blue"
            mode="fill"
            size="sm"
            className={styles['panel__category']}
            onClick={() => onCategoryClick(cat.code)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <Button variant="danger" mode="outline" className={styles['panel__reset']} onClick={onReset}>
        초기화
      </Button>
    </div>
  );
}
