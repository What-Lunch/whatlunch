export function shuffle<T>(array: T[]): T[] {
  const result = [...array]; // 원본 배열 복사로 side-effect 방지

	// 배열의 끝(i)부터 두 번째 요소(i = 1)까지 뒤에서부터 순회
  for (let i = result.length - 1; i > 0; i--) {
	  // 0 이상 i 이하의 정수 j의 인덱스를 무작위로 선택
    // (i + 1)을 곱해야 0부터 i까지 총 (i+1)개의 후보를 공정하게 뽑을 수 있음
    const j = Math.floor(Math.random() * (i + 1)); 

    // 현재 확정 자리(i)의 값과 무작위 후보 자리(j)의 값을 교환
    // ES6 구조 분해 할당을 사용하여 간결하게 처리
    [result[i], result[j]] = [result[j], result[i]]; 
  }
  
  return result;
}