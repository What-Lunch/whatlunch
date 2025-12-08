import { range } from "../range";

describe("range 유틸리티 유닛 테스트", () => {
  // 1. 기본적인 닫힌 구간(Inclusive) 생성 테스트
  it("start < end 인 경우 양 끝값을 포함한 올바른 배열을 반환해야 한다", () => {
    expect(range(0, 3)).toEqual([0, 1, 2, 3]);
    expect(range(2, 5)).toEqual([2, 3, 4, 5]);
  });

  // 2. 단일 요소 범위 테스트
  it("start === end 인 경우 해당 숫자 하나만 포함된 배열을 반환해야 한다", () => {
    expect(range(4, 4)).toEqual([4]);
  });

  // 3. 예외적인 역전 범위 테스트
  it("start > end 인 경우 빈 배열을 반환해야 한다", () => {
    expect(range(5, 2)).toEqual([]);
    expect(range(1, 0)).toEqual([]);
  });

  // 4. 음수 영역 테스트
  it("음수가 포함된 범위도 순서대로 올바르게 생성해야 한다", () => {
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
  });

  // 5. 대량 데이터 생성 및 길이 테스트
  it("큰 범위 생성 시 배열의 길이와 시작/끝 값이 정확해야 한다", () => {
    const result = range(0, 100);
    expect(result.length).toBe(101);
    expect(result[0]).toBe(0);
    expect(result[100]).toBe(100);
  });

  // 6. 반환된 배열의 독립성 테스트 - 내용은 같지만 참조 주소는 다르게
  it("생성된 배열은 호출할 때마다 새로운 참조(Reference)여야 한다", () => {
    const first = range(0, 2);
    const second = range(0, 2);
    
    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});