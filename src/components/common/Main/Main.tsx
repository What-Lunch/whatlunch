import styles from './Main.module.scss';

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles['main']}>
      <div className={styles['main__content']}>{children}</div>
    </main>
  );
}
