import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherMood from '@/components/WeatherMood/WeatherMood';

const mockGeolocation = {
  getCurrentPosition: jest.fn<
    void,
    [success: (pos: GeolocationPosition) => void, error?: (err: GeolocationPositionError) => void]
  >(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

global.fetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => (store[key] = value),
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function mockTime(hour: number) {
  jest.useFakeTimers();
  const mockDate = new Date(2025, 0, 1, hour, 0, 0);
  jest.setSystemTime(mockDate);
}

describe('WeatherMood 통합 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('위치 권한 요청이 실행된다', async () => {
    mockTime(9);

    mockGeolocation.getCurrentPosition.mockImplementationOnce(success =>
      success({
        coords: { latitude: 37.5, longitude: 127 },
      } as GeolocationPosition)
    );

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<WeatherData> => ({
        name: 'Seoul',
        main: { temp: 11 },
        weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
      }),
    });

    render(<WeatherMood />);

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
  });

  test('위치 권한 거부 시, 서울 기본값을 사용한다', async () => {
    mockTime(10);

    mockGeolocation.getCurrentPosition.mockImplementationOnce((_success, error) =>
      error?.({
        code: 1,
        PERMISSION_DENIED: 1,
        message: 'denied',
      } as GeolocationPositionError)
    );

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<WeatherData> => ({
        name: 'Seoul',
        main: { temp: 8 },
        weather: [{ main: 'Clouds', description: '흐림', icon: '02d' }],
      }),
    });

    render(<WeatherMood />);

    await waitFor(() => {
      expect(screen.getByText(/Seoul/)).toBeInTheDocument();
    });
  });

  test('날씨에 따른 추천 메뉴가 화면에 표시된다', async () => {
    mockTime(10);

    mockGeolocation.getCurrentPosition.mockImplementationOnce(success =>
      success({
        coords: { latitude: 37, longitude: 127 },
      } as GeolocationPosition)
    );

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<WeatherData> => ({
        name: 'Seoul',
        main: { temp: 5 },
        weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
      }),
    });

    render(<WeatherMood />);

    await waitFor(() => {
      expect(screen.getByText(/Seoul/)).toBeInTheDocument();
      expect(screen.getByText(/맑음/)).toBeInTheDocument();
    });
  });

  test('탭을 클릭하면 MoodRecommend가 렌더링된다', async () => {
    mockTime(10);

    mockGeolocation.getCurrentPosition.mockImplementationOnce(success =>
      success({
        coords: { latitude: 37, longitude: 127 },
      } as GeolocationPosition)
    );

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<WeatherData> => ({
        name: 'Seoul',
        main: { temp: 11 },
        weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
      }),
    });

    render(<WeatherMood />);

    fireEvent.click(screen.getByText('기분에 따른'));

    await waitFor(() => {
      expect(screen.getByText('기쁨')).toBeInTheDocument();
    });
  });

  test('기분 버튼을 누르면 추천 메뉴가 변경된다', async () => {
    mockTime(12);

    mockGeolocation.getCurrentPosition.mockImplementationOnce(success =>
      success({
        coords: { latitude: 37, longitude: 127 },
      } as GeolocationPosition)
    );

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async (): Promise<WeatherData> => ({
        name: 'Seoul',
        main: { temp: 12 },
        weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
      }),
    });

    render(<WeatherMood />);

    fireEvent.click(screen.getByText('기분에 따른'));

    await waitFor(() => {
      expect(screen.getByText('초밥')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('우울'));

    await waitFor(() => {
      expect(screen.getByText('마라탕')).toBeInTheDocument();
      expect(screen.getByText('초코케이크')).toBeInTheDocument();
    });
  });
});
