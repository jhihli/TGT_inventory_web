'use client';

import { DeleteButton } from './delete-button';
import { CreateProduct } from './buttons';
import { DeleteMessage } from './table';
//import {DataTableExport} from './export-button';
import Search from '@/app/ui/search';

export default function ClientActionBar({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center w-full sm:w-auto">
          <Search placeholder="Search products..." />
          <div className="ml-2">
            <DeleteMessage />
          </div>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <DeleteButton/>
          {/* <DataTableExport/> */}
          <CreateProduct />
        </div>
      </div>
    </div>
  );
}
