'use client';

import { Product } from '@/interface/IDatatable';
import { updateProduct } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { FormEvent } from 'react';


interface Props {
  product: Product;
}


export default function EditProductForm({ product }: Props) {

  const router = useRouter();

  const [formData, setFormData] = useState<Product>(product);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);


    try {
      // Ensure correct data types are passed to updateProduct
      await updateProduct(product.id, formData.number, formData.qty);
      router.push('/dashboard');

    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'qty' ? parseInt(value, 10) || 0 : value // Parse qty to number, handle empty input
    }))

  };



  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">
          <label htmlFor="number" className="mb-2 block text-sm font-medium">
            Product Number
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>


        <div className="mb-4">
          <label htmlFor="qty" className="mb-2 block text-sm font-medium">
            Quantity
          </label>
          <div className="relative mt-2 rounded-md">

            <input
              id="qty"
              name="qty"
              type="number"
              value={formData.qty}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>

      </div>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard" // Changed to dashboard
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-500 h-10 py-2 px-4">

          {isSubmitting ? 'Submitting...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
