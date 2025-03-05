"use client"
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createProduct } from '@/app/lib/actions';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { useFormState } from 'react-dom';

export default function Form() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [number, setNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState(searchParams.get('query') || '');
  const [vender, setVender] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('0'); // 設定預設值為 '0'
  const [dateError, setDateError] = useState('');

  // Handle date change and update URL
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Format: YYYY-MM-DD
    setDate(value);

    if (!value) {
      setDateError('Date is required');
      return; // Don't update URL if empty
    } else {
      setDateError(''); // Clear error if valid
    }

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    router.push(`?${params.toString()}`);
  };

  const initialState = { message: null, errors: {} };
  // const [state, submitform] = useFormState(createProduct, initialState);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('number', number);
    formData.append('barcode', barcode);
    formData.append('qty', qty);
    formData.append('date', date);
    formData.append('vender', vender);
    formData.append('client', client);
    formData.append('category', category);
    
    try {
      const result = await createProduct(formData);
      console.log('result', result);
  
      if (result && result.success) {
        // Redirect to the dashboard on successful product creation
        router.push('/dashboard');
      } else {
        // Handle errors if needed
        console.error('Failed to create product:', result?.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      <div className="rounded-lg bg-white shadow-md p-8 md:p-10 border border-gray-100">
        
        <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                  <PencilSquareIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>New Product</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Number */}
          <div className="mb-4">
            <label htmlFor="number" className="mb-3 block text-base font-medium text-gray-700">
              Number
            </label>
            <div className="relative">
              <input
                id="number"
                name="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter product number"
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-gray-500 size-6">
                <path fillRule="evenodd" d="M7.491 5.992a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.49 11.995a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.491 17.994a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.24 3.745a.75.75 0 0 1 .75-.75h1.125a.75.75 0 0 1 .75.75v3h.375a.75.75 0 0 1 0 1.5H2.99a.75.75 0 0 1 0-1.5h.375v-2.25H2.99a.75.75 0 0 1-.75-.75ZM2.79 10.602a.75.75 0 0 1 0-1.06 1.875 1.875 0 1 1 2.652 2.651l-.55.55h.35a.75.75 0 0 1 0 1.5h-2.16a.75.75 0 0 1-.53-1.281l1.83-1.83a.375.375 0 0 0-.53-.53.75.75 0 0 1-1.062 0ZM2.24 15.745a.75.75 0 0 1 .75-.75h1.125a1.875 1.875 0 0 1 1.501 2.999 1.875 1.875 0 0 1-1.501 3H2.99a.75.75 0 0 1 0-1.501h1.125a.375.375 0 0 0 .036-.748H3.74a.75.75 0 0 1-.75-.75v-.002a.75.75 0 0 1 .75-.75h.411a.375.375 0 0 0-.036-.748H2.99a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Barcode */}
          <div className="mb-4">
            <label htmlFor="barcode" className="mb-3 block text-base font-medium text-gray-700">
              Barcode
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                id="barcode"
                name="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter barcode"
                required
              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-gray-500 size-6">
                <path fillRule="evenodd" d="M7.491 5.992a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.49 11.995a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM7.491 17.994a.75.75 0 0 1 .75-.75h12a.75.75 0 1 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.24 3.745a.75.75 0 0 1 .75-.75h1.125a.75.75 0 0 1 .75.75v3h.375a.75.75 0 0 1 0 1.5H2.99a.75.75 0 0 1 0-1.5h.375v-2.25H2.99a.75.75 0 0 1-.75-.75ZM2.79 10.602a.75.75 0 0 1 0-1.06 1.875 1.875 0 1 1 2.652 2.651l-.55.55h.35a.75.75 0 0 1 0 1.5h-2.16a.75.75 0 0 1-.53-1.281l1.83-1.83a.375.375 0 0 0-.53-.53.75.75 0 0 1-1.062 0ZM2.24 15.745a.75.75 0 0 1 .75-.75h1.125a1.875 1.875 0 0 1 1.501 2.999 1.875 1.875 0 0 1-1.501 3H2.99a.75.75 0 0 1 0-1.501h1.125a.375.375 0 0 0 .036-.748H3.74a.75.75 0 0 1-.75-.75v-.002a.75.75 0 0 1 .75-.75h.411a.375.375 0 0 0-.036-.748H2.99a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Qty */}
          <div className="mb-4">
            <label htmlFor="qty" className="mb-3 block text-base font-medium text-gray-700">
              Quantity
            </label>
            <div className="relative">
              <input
                id="qty"
                name="qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter quantity"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-gray-500 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
          </div>

          {/* Date (Required) */}
          <div className="mb-4">
            <label htmlFor="date" className="mb-3 block text-base font-medium text-gray-700">
              Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="date"
                name="date"
                type="date"
                value={date}
                required
                onChange={handleDateChange}
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-4 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setDate(new Date().toISOString().split('T')[0])}
                className="ml-3 rounded-md bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 transition-colors text-base font-medium"
              >
                Today
              </button>
            </div>
            {dateError && (
            <p className="mt-2 text-base text-red-500">{dateError}</p>
            )}
          </div>

          {/* Vender */}
          <div className="mb-4">
            <label htmlFor="vender" className="mb-3 block text-base font-medium text-gray-700">
              Vendor
            </label>
            <div className="relative">
              <input
                id="vender"
                name="vender"
                value={vender}
                onChange={(e) => setVender(e.target.value)}
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter vendor name"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-gray-500 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          {/* Client */}
          <div className="mb-4">
            <label htmlFor="client" className="mb-3 block text-base font-medium text-gray-700">
              Client
            </label>
            <div className="relative">
              <input
                id="client"
                name="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter client name"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-gray-500 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4 md:col-span-2">
            <label htmlFor="category" className="mb-3 block text-base font-medium text-gray-700">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="peer block w-full rounded-md border border-gray-300 py-3 pl-12 text-base outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="0">Normal</option>
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="pointer-events-none absolute left-3 top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-gray-500 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 flex justify-end gap-6">
        <Link
          href="/dashboard"
          className="flex h-12 items-center rounded-lg bg-gray-100 px-8 text-base font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-6 text-base">
          Create Product
        </Button>
      </div>
    </form>
  );
}
