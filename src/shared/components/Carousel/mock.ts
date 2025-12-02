import One1 from '../../../../public/images/test/1.jpeg';
import One2 from '../../../../public/images/test/2.jpeg';
import One5 from '../../../../public/images/test/15.jpeg';
import Two1 from '../../../../public/images/test/6.jpeg';
import Two2 from '../../../../public/images/test/7.jpeg';
import Two3 from '../../../../public/images/test/8.jpeg';
import Two4 from '../../../../public/images/test/9.jpeg';
import Two5 from '../../../../public/images/test/5.jpeg';
import Three1 from '../../../../public/images/test/10.jpeg';
import Three4 from '../../../../public/images/test/14.jpeg';

/**
 * TODO: 백엔드 연동시 mock 데이터 제거 필요
 */

const TestImage = [One1, One2, One1, One2, One5];
const TestImage2 = [Two1, Two2, Two3, Two4, Two5];
const TestImage3 = [Three1, Three1, Three4, Three4, Three1];
// 테스트용 이미지 데이터
const pendingData = [
  {
    src: TestImage,
    title: '너무맛있는곰장어집',
    category: '식당',
    rating: 4.5,
    location: '서울 마포',
  },
  {
    src: TestImage2,
    title: '여긴어디지고기집',
    category: '식당',
    rating: 4.0,
    location: '서울 강남',
  },
  {
    src: TestImage3,
    title: '메가메가메가커피',
    category: '카페',
    rating: 3.5,
    location: '충남 대전',
  },
];

export default pendingData;
