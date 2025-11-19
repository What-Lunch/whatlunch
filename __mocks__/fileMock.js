import path from 'path';

const fileMock = {
  src: '',
  height: 100,
  width: 100,
  blurDataURL: '',
  toString() {
    return `mock-${path.basename(this.src || Math.random().toString())}`;
  },
};

export default fileMock;
