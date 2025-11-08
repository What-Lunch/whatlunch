import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>오늘 뭐먹지?</h1>
      <button className={styles.button}>메뉴 고르기</button>
    </div>
  );
}
