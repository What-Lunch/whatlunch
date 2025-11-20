import '@testing-library/jest-dom';

jest.mock('next/image', () => {
  const MockNextImage = props => {
    return <img {...props} />;
  };
  MockNextImage.displayName = 'NextImage';
  return { __esModule: true, default: MockNextImage };
});
