import { authServiceServer } from '@/app/services/backend/auth.api';

import HeaderClient from './HeaderClient';

export default async function Header() {
  const user = await authServiceServer.getMe();

  if (!user) return null;
  return <HeaderClient user={user} />;
}
