import Form from '@/app/ui/dashboard/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Suspense } from 'react';
 
export default function Page() {
  //const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard' },
          {
            label: 'Create',
            href: '/dashboard/create',
            active: true,
          },
        ]}
      />
      <Suspense fallback={<div>Loading form...</div>}>
        <Form/>
      </Suspense>
    </main>
  );
}