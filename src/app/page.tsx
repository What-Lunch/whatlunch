import styles from './page.module.scss';

export default function HomePage() {
  // scss를 쓸 때 2가지 방법이 있습니다.
  // 아래 두 가지 방법은 동일한데 보통 두 번째 방법을 더 선호합니다.
  // 이유는 만약 클래스 이름에 하이픈(-)이 포함되어 있을 때 첫 번째 방법은 에러가 발생하기 때문입니다.
  // 그래서 보통은 두 번째 방법을 더 선호합니다. 두번째 방법으로 통일합시다.
  // <>
  //   <div className={styles.container} />
  //   <div className={styles['container']} />
  // </>;

  // container 클래스안에 container__title 클래스가 있습니다.
  //   .container {
  //   &__title {
  //     @include m.text-style-extended('2xl', 500, blue-800);
  //     margin-bottom: 15px;
  //   }
  // }
  // 위처럼 쓰면 .container__title 클래스가 적용됩니다.asdfadsf
  return (
    <div className={styles['container']}>
      <h1>오늘 뭐먹지?</h1>
      <h2 className={styles['container__title']}>메뉴 고민 끝!</h2>
      <button className={styles['button']}>메뉴 고르기</button>
    </div>
  );
}
