import { generateRecommendations } from '../components/Mood/utils/recommendEngine';

describe('셔플 테스트', () => {
  const menus = ['피자', '햄버거', '치킨', '파스타'];

  it('입력된 메뉴 개수를 유지한다', () => {
    const result = generateRecommendations(menus);

    expect(result).toHaveLength(menus.length);
  });

  it('입력된 메뉴와 동일한 원소 집합을 가진다', () => {
    const result = generateRecommendations(menus);

    expect(result.sort()).toEqual([...menus].sort());
  });

  it('원본 배열을 변경하지 않는다 (immutability)', () => {
    const copy = [...menus];

    generateRecommendations(menus);

    expect(menus).toEqual(copy);
  });

  it('랜덤 로직을 사용한다', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.3);

    generateRecommendations(menus);

    expect(randomSpy).toHaveBeenCalled();

    randomSpy.mockRestore();
  });
});
