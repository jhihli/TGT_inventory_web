import Table from '@/app/ui/dashboard/table';
import { lusitana } from '@/app/ui/fonts';
import Pagination from '@/app/ui/dashboard/pagination';
import { ProductsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchProductsTotalPage, getProducts } from '@/app/lib/data';
import { DeleteMessageProvider } from '@/app/ui/dashboard/table';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import ClientActionBar from '@/app/ui/dashboard/client-action-bar';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  let currentPage = Number(params?.page) || 1;

  try {
    const totalPages = await fetchProductsTotalPage(query);
    
    // 調整當前頁碼以確保在有效範圍內
    if (totalPages > 0) {
      currentPage = Math.min(Math.max(1, currentPage), totalPages);
    } else {
      currentPage = 1;
    }

    const products = await getProducts(query, currentPage);

    return (
      <DeleteMessageProvider>
        <div className="w-full">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ArchiveBoxIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
                  Product Inventory
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                {products.length} products • Page {currentPage} of {totalPages || 1}
              </div>
            </div>
          </div>

          <ClientActionBar query={query} currentPage={currentPage} />

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Suspense fallback={<ProductsTableSkeleton />}>
              <Table initialProducts={products} query={query} currentPage={currentPage} />
            </Suspense>
          </div>

          {/* Pagination Section */}
          <div className="mt-4 flex justify-center">
            <Pagination totalPages={totalPages || 1} />
          </div>
        </div>
      </DeleteMessageProvider>
    );
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // 發生錯誤時顯示空狀態
    return (
      <DeleteMessageProvider>
        <div className="w-full">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ArchiveBoxIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
                  Product Inventory
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                0 products • Page 1 of 1
              </div>
            </div>
          </div>

          <ClientActionBar query={query} currentPage={1} />

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Suspense fallback={<ProductsTableSkeleton />}>
              <Table initialProducts={[]} query={query} currentPage={1} />
            </Suspense>
          </div>

          {/* Pagination Section */}
          <div className="mt-4 flex justify-center">
            <Pagination totalPages={1} />
          </div>
        </div>
      </DeleteMessageProvider>
    );
  }
}