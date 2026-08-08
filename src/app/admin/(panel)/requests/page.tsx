import {
  getAdminBookingRequests,
} from '@/entities/booking/server';

import {
  AdminRequestsPage,
} from '@/views/';

export default async function Page() {
  const requests =
    await getAdminBookingRequests();

  return (
    <AdminRequestsPage
      initialRequests={requests}
    />
  );
}