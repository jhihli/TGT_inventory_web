import Form from '@/app/ui/dashboard/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchProductById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Product } from '@/interface/IDatatable'; // Import the Product type


export default async function Page({ params }: { params: Promise<{ id: string }> }) { // id should be a string here


    const productParams = await params; // Await params if it's a Promise
    if (!productParams || !productParams.id) {
        return <div>Error: Missing product </div>;
    }


    const product = await fetchProductById(BigInt(productParams.id)); // Directly assign the result


    if (!product) {
        return notFound(); // Use return for notFound() 
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Products', href: '/dashboard' }, // Corrected href
                    { label: 'Edit Product', href: `/dashboard/${productParams.id}/edit`, active: true }, // Corrected label
                ]}
            />
            <Form product={product} />
        </main>
    );
}

