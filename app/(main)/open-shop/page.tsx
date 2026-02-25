import { getUserStoreRequest } from '@/lib/actions/store-requests';
import OpenShopClient from './open-shop-client';

export const metadata = {
  title: 'Buka Toko - Innovillage',
};

export default async function OpenShopPage() {
  const existingRequest = await getUserStoreRequest();

  return <OpenShopClient existingRequest={existingRequest} />;
}
