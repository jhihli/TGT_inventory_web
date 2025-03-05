'use server';

import { z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const API_URL = process.env.NEXT_PUBLIC_Django_API_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;




const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateProdut = InvoiceSchema.omit({ id: true, date: true });

const ProductSchema = z.object({
  number: z.string(),
  barcode: z.string(),
  qty: z.string(),
  date: z.string(),
});

// export type State = {
//   errors?: {
//     customerId?: string[];
//     amount?: string[];
//     status?: string[];
//   };
//   message?: string | null;
// };

export async function createProduct(formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    number: formData.get('number'),
    barcode: formData.get('barcode'),
    qty: formData.get('qty'),
    date: formData.get('date'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create product.',
    };
  }

  const { number, barcode, qty, date } = validatedFields.data;
  
  // Get additional fields from the form
  const vender = formData.get('vender') || 'default_vender';
  const client = formData.get('client') || 'default_client';
  const category = formData.get('category') || 'default_category';

  try {
    if (!API_URL) {
      throw new Error("API URL is not set!");
    }

    console.log('Sending product data to:', `${API_URL}/product/products/`);
    
    // Use the products endpoint with POST method
    const response = await fetch(`${API_URL}/product/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: number || 'default_number',
        barcode: barcode || 'default_barcode',
        qty: parseInt(qty) || 0,  // Convert to integer as required by the model
        date,
        vender,
        client,
        category
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Server response:', responseText);
      
      let errorMessage;
      try {
        // Try to parse as JSON if possible
        const errorData = JSON.parse(responseText);
        errorMessage = JSON.stringify(errorData);
      } catch (e) {
        // If not JSON, use the text directly (truncated)
        errorMessage = responseText.substring(0, 100) + '...';
      }
      
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    // Parse the successful response
    const data = await response.json();
    console.log('Product created successfully:', data);

    revalidatePath('/dashboard');
    return { 
      success: true, 
      message: 'Product created successfully', 
      errors: null,
      data 
    };
  } catch (error) {
    console.error('Failed to create product:', error);
    return {
      success: false,
      message: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      errors: {},
      data: null
    };
  }
}

export async function deleteProducts(ids: string[]) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not set!");
    }

    console.log('Deleting products with IDs:', ids);
    
    // Delete each product one by one using the correct endpoint
    const deletePromises = ids.map(async (id) => {
      const url = `${API_URL}/product/products/${id}/`;
      console.log('Sending DELETE request to:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error(`Failed to delete product ${id}. Server response:`, responseText);
        throw new Error(`Failed to delete product with ID ${id}: ${response.status}`);
      }
      
      return id;
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    // Revalidate the dashboard path to refresh the data
    revalidatePath('/dashboard');
    return { success: true, message: `Successfully deleted ${ids.length} products` };
  } catch (error) {
    console.error('Failed to delete products:', error);
    return { 
      success: false, 
      message: `Failed to delete products: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

export async function updateProduct(id: string, formData: { 
  number: string; 
  barcode: string; 
  qty: string | number; 
  date: string;
  vender?: string;
  client?: string;
  category?: string;
}) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not set!");
    }

    const url = `${API_URL}/product/products/${id}/`;
    console.log('Sending PUT request to:', url);

    // Ensure qty is sent as a number
    const processedData = {
      ...formData,
      qty: typeof formData.qty === 'string' ? parseInt(formData.qty) : formData.qty
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedData),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Failed to update product. Server response:', responseText);
      throw new Error(`Failed to update product with ID ${id}: ${response.status}`);
    }

    const data = await response.json();
    console.log('Product updated successfully:', data);

    revalidatePath('/dashboard');
    return { success: true, message: 'Product updated successfully', data };
  } catch (error) {
    console.error('Failed to update product:', error);
    return {
      success: false,
      message: `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

//// Use Zod to update the expected types
//const UpdateInvoice = InvoiceSchema.omit({ id: true, date: true });

// ...

// export async function updateInvoice(
//   id: string,
//   prevState: State,
//   formData: FormData
// ){

//   // Validate form fields using Zod
//   const validatedFields = UpdateInvoice.safeParse({
//     customerId: formData.get('customerId'),
//     amount: formData.get('amount'),
//     status: formData.get('status'),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Update Invoice.',
//     };
//   }

//   // Prepare data for insertion into the database
//   const { customerId, amount, status } = validatedFields.data;
//   const amountInCents = amount * 100;
//   // Insert data into the database
//   try {
//     await sql`
//       UPDATE invoices
//       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
//       WHERE id = ${id}
//     `;
//   } catch (error) {
//     return { message: 'Database Error: Failed to Update Invoice.' };
//   }
//   // Revalidate the cache for the invoices page and redirect the user.
//   revalidatePath('/dashboard/invoices');
//   redirect('/dashboard/invoices');
// }

// export async function deleteInvoice(id: string) {
//   // throw new Error('Failed to Delete Invoice');
//   try {
//     await sql`DELETE FROM invoices WHERE id = ${id}`;
//     revalidatePath('/dashboard/invoices');
//   } catch (error) {
//     return { message: 'Database Error: Failed to Delete Invoice.' };
//   }
// }


// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', Object.fromEntries(formData));
//   } catch (error) {
//     if ((error as Error).message.includes('CredentialsSignin')) {
//       return 'CredentialSignin';
//     }
//     throw error;
//   }
// }