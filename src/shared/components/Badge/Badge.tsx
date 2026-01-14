import { BadgeProps } from './types';
import styles from './Badge.module.scss';

export default function Badge({ id, variant = 'blue', Icon, text }: BadgeProps) {
  return (
    <span key={id} className={`${styles['badge__stat']} ${styles[`badge__stat--${variant}`]}`}>
      {Icon && <Icon className={styles['badge__stat-icon']} />}
      {text}
    </span>
  );
}
