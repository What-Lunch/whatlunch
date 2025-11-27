import styles from './Main.module.scss';

interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
  return (
    <main className={styles['main']}>
      <div className={styles['main__content']}>{children}</div>
    </main>
  );
}
