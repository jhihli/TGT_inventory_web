"use client";

import { Product } from '@/interface/IDatatable';
import { createProduct } from '@/app/lib/actions'; // Import your createProduct action
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormEvent } from 'react';


export const ProductCreateForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'date'>>({
        number: '',
        qty: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await createProduct(formData.number, formData.qty);
            router.refresh(); // Refresh the page after successful creation
        } catch (err: any) {
            console.error("Error creating product:", err);
            setError(err.message || "Failed to create product.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'qty' ? parseInt(value, 10) || 0 : value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-md bg-gray-50 p-4 md:p-6 mb-4"> {/* Added margin-bottom */}
            <div className="mb-4">
                <label htmlFor="number" className="mb-2 block text-sm font-medium">
                    Product Number
                </label>
                <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="qty" className="mb-2 block text-sm font-medium">
                    Quantity
                </label>
                <input
                    id="qty"
                    name="qty"
                    type="number"
                    value={formData.qty}
                    onChange={handleChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-6 flex justify-end gap-4"> {/* Button container */}
                <button
                    type="button" // Make this a regular button
                    // onClick={() => setShowCreateForm(false)}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-500 h-10 py-2 px-4"
                >
                    {isSubmitting ? 'Submitting...' : 'Create Product'}
                </button>
            </div>

        </form>
    );
};
