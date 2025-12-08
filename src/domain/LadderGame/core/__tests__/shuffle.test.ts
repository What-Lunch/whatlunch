import { shuffle } from "../shuffle";

describe("shuffle 유닛 테스트", () => {
  // 1. 기본 구조 검증
  it("원본 배열 길이를 유지해야 한다", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result.length).toBe(arr.length);
  });

  it("원본 배열의 요소들이 누락 없이 모두 포함되어야 한다", () => {
    const arr = [1, 2, 3];
    const result = shuffle(arr);
    expect([...result].sort()).toEqual([...arr].sort());
  });

  // 2. 불변성(Immutability) 테스트 - 핵심 추가 사항
  it("원본 배열을 수정하지 않고 새로운 배열을 반환해야 한다", () => {
    const arr = [1, 2, 3];
    const originalCopy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(originalCopy);
  });

  // 3. 경계 조건 테스트 - 핵심 추가 사항
  it("빈 배열이나 단일 요소 배열을 넣었을 때 정상 작동해야 한다", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([1])).toEqual([1]);
  });

  // 4. 무작위성 테스트 (확률 기반 개선)
  it("섞인 배열은 높은 확률로 원본 배열과 순서가 달라야 한다", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffle(arr);
    
    const isSameOrder = JSON.stringify(arr) === JSON.stringify(result);

    expect(isSameOrder).toBe(false);
  });
});