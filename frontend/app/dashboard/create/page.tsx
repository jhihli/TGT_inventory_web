import Form from '@/app/ui/dashboard/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() {
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
      <Form/>
    </main>
  );
}