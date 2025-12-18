import { TabButtonProps } from './type';

import styles from './TabButton.module.scss';

export default function TabButton({ value, tab, onChange, icon, children }: TabButtonProps) {
  const active = value === tab;

  const className = active
    ? `${styles['tabButton']} ${styles['tabButton--active']}`
    : styles['tabButton'];

  return (
    <button className={className} onClick={() => onChange(value)}>
      {icon && <span className={styles['tabButton__icon']}>{icon}</span>}
      {children}
    </button>
  );
}
