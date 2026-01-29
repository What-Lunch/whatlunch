export function createStoresByMenu(menuName: string, image: string) {
  return [
    {
      id: `${menuName}-01`,
      name: `${menuName} 맛집 1`,
      location: '강남',
      image,
    },
    {
      id: `${menuName}-02`,
      name: `${menuName} 맛집 2`,
      location: '홍대',
      image,
    },
    {
      id: `${menuName}-03`,
      name: `${menuName} 맛집 3`,
      location: '잠실',
      image,
    },
    {
      id: `${menuName}-04`,
      name: `${menuName} 맛집 4`,
      location: '합정',
      image,
    },
  ];
}
