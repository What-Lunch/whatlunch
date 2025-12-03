import { render, screen, fireEvent, act } from '@testing-library/react';
import Map from '../Map';

jest.mock('../hooks/useMapMarkers', () => ({
  useMapMarkers: () => ({
    createMarkers: jest.fn(),
    resetMarkers: jest.fn(),
    activateMarkerById: jest.fn(),
  }),
}));

jest.mock('../hooks/useMapKakaoLoader', () => ({
  useMapKakaoLoader: () => ({
    loadKakao: jest.fn(() => Promise.resolve()),
    waitForKakao: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock('../hooks/useMapKakaoMap', () => ({
  useMapKakaoMap: () => ({
    kakaoRef: { current: global.kakao },
    setKakao: jest.fn(),
    mapObjRef: { current: { setCenter: jest.fn(), setLevel: jest.fn() } },
    clustererRef: { current: null },
    userLocationRef: { current: { lat: 37.5665, lng: 126.978 } },
    initMap: jest.fn(),
  }),
}));

beforeAll(() => {
  global.kakao = {
    maps: {
      load: (cb: () => void) => cb(),

      LatLng: jest.fn().mockImplementation((lat: number, lng: number) => ({
        getLat: () => lat,
        getLng: () => lng,
      })),

      Map: jest.fn().mockImplementation(() => ({
        setCenter: jest.fn(),
        setLevel: jest.fn(),
      })),

      Marker: jest.fn(),
      MarkerImage: jest.fn(),
      Size: jest.fn(),
      InfoWindow: jest.fn(),
      MarkerClusterer: jest.fn(),
      event: { addListener: jest.fn() },

      services: {
        Status: {
          OK: 'OK',
          ZERO_RESULT: 'ZERO_RESULT',
          ERROR: 'ERROR',
        },

        Places: jest.fn().mockImplementation(() => ({
          keywordSearch: jest.fn((keyword, callback) => {
            callback(
              [
                {
                  id: '1',
                  place_name: '테스트식당',
                  road_address_name: '서울 어딘가 123',
                  address_name: '서울시 강남구',
                  phone: '010-1111-2222',
                  place_url: 'https://place.map.kakao.com/1',
                  x: '127.0',
                  y: '37.0',
                },
              ],
              'OK'
            );
          }),

          categorySearch: jest.fn((code, callback) => {
            callback(
              [
                {
                  id: '2',
                  place_name: '카테고리식당',
                  road_address_name: '서울 종로구 10',
                  address_name: '서울시 종로구',
                  phone: '02-333-4444',
                  place_url: 'https://place.map.kakao.com/2',
                  x: '127.1',
                  y: '37.1',
                },
              ],
              'OK'
            );
          }),
        })),
      },
    },
  };

  // geolocation Mock
  Object.defineProperty(global.navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn(success =>
        success({
          coords: {
            latitude: 37.5665,
            longitude: 126.978,
          },
        })
      ),
    },
  });
});

// 통합 테스트
describe('Map 통합 테스트', () => {
  test('검색 → 리스트 표시 → 리스트 클릭까지 전체 동작', async () => {
    await act(async () => {
      render(<Map />);
    });

    const input = screen.getByPlaceholderText(/검색/);
    fireEvent.change(input, { target: { value: '라멘' } });

    fireEvent.click(screen.getByRole('button', { name: '검색' }));

    const item = await screen.findByText('테스트식당');
    expect(item).toBeInTheDocument();

    fireEvent.click(item);

    expect(item.parentElement?.className).toMatch(/active/i);
  });

  test('카테고리 검색 동작', async () => {
    await act(async () => {
      render(<Map />);
    });

    fireEvent.click(screen.getByText('음식점'));

    const item = await screen.findByText('카테고리식당');
    expect(item).toBeInTheDocument();
  });

  test('초기화 버튼 동작', async () => {
    await act(async () => {
      render(<Map />);
    });

    fireEvent.change(screen.getByPlaceholderText(/검색/), {
      target: { value: '라멘' },
    });
    fireEvent.click(screen.getByRole('button', { name: '검색' }));

    const item = await screen.findByText('테스트식당');
    expect(item).toBeInTheDocument();

    fireEvent.click(screen.getByText('초기화'));

    expect(screen.queryByText('테스트식당')).toBeNull();
  });
});
