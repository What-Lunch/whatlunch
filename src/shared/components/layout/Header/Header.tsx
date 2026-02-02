import { authServiceServer } from '@/app/services/backend/auth.api';
import HeaderClient from './HeaderClient';

export default async function Header() {
  try {
    const user = await authServiceServer.getMe();
    return <HeaderClient user={user} />;
  } catch {
    return <HeaderClient user={null} />;
  }
}
