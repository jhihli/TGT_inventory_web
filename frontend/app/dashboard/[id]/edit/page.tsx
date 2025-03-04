import { getProductById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditForm from '@/app/ui/dashboard/edit-form';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{ id: string }>; // Match Next.js's expectation for async params
  };
 
export default async function Page({ params }: PageProps) {  //{ params }: { params: { id: string } }
   
    //const params = useParams<{ id: string }>()
    //const id = Promise.resolve(params.id);
    // Await params if it's a Promise
    const resolvedParams = await params; // Resolve the Promise directly
    const id = resolvedParams.id; // Now safely access id after resolving params

    
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Products', href: '/dashboard' },
                    {
                        label: 'Edit',
                        href: `/dashboard/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            
            <EditForm product={product} />
        </main>
    );
}