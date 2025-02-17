"use client"
import Search from '@/app/ui/search';
import Table from '@/app/ui/dashboard/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import Pagination from '@/app/ui/invoices/pagination';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense, useState, useEffect } from 'react';
import { getProducts } from "@/utils/product";
import { Product } from "@/interface/IDatatable"




export default function Page() {

    // const searchParams = await props.searchParams;
    // const query = searchParams?.query || '';
    // const currentPage = Number(searchParams?.page) || 1;


    // const [products, setProducts] = useState<Product[]>([]);

    // useEffect(() => {
    //   const fetchProducts = async () => {
    //     try {
    //       const data: Product[] = await getProducts();
    //       setProducts(data);
    //     } catch (error) {
    //       console.error("Error fetching products:", error);
    //     }
    //   };
    //   fetchProducts();
    // }, []);

    // useEffect(() => {
    //   console.log('products', products);  
    // }, [products]);

    //const totalPages = await fetchProductPages(query);

    // const [showCreateForm, setShowCreateForm] = useState(false);

    // const handleCreateInvoiceClick = () => {
    //     setShowCreateForm(true);
    // };

    return (
        <div className="w-full">
            {/* <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
            </div> */}
            {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search products..." />

                <button
                    onClick={handleCreateInvoiceClick}
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block">Create Product</span>{' '}

                </button>


            </div> */}

            {/* Conditionally render the create form */}
            {/* {showCreateForm && (
                <ProductCreateForm />
            )} */}
            {/* <Suspense key={query + currentPage} >
                <Table query={query} currentPage={currentPage} />
            </Suspense> */}
            <Table />
            {/* <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div> */}
        </div>
    );
}