
import Search from '@/app/ui/search';
import Table from '@/app/ui/dashboard/table';
import { CreateProduct } from '@/app/ui/dashboard/buttons';
import { lusitana } from '@/app/ui/fonts';
import Pagination from '@/app/ui/dashboard/pagination';
import { ProductsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense} from 'react'; //, useState, useEffect 
import { fetchProductsTotalPage } from '@/app/lib/data';



export default async function Page(props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';  // Default to page 1
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchProductsTotalPage(query);
  
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search products..." />

                <CreateProduct />


            </div>

            <Suspense key={query + currentPage} fallback={<ProductsTableSkeleton />}> 
                <Table query={query} currentPage={currentPage} /> {/*query={query} currentPage={currentPage}*/}
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}