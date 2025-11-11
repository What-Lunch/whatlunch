/** @type {import('prettier').Config} */
module.exports = {
  semi: true, // 세미콜론 사용
  singleQuote: true, // 홀따옴표 사용

  // 기타 일반 설정
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100, // 한 줄 최대 길이
  bracketSpacing: true, // 객체 괄호 공백
  jsxSingleQuote: false, // JSX는 큰따옴표 유지
  arrowParens: 'avoid',
};
