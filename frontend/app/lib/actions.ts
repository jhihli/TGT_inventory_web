"use server"

import { PrismaClient } from '@prisma/client';
import { Console } from 'console';
import exp from 'constants';
import { revalidatePath } from 'next/cache'; // Assuming this is from Next.js caching

const prisma = new PrismaClient();

export async function deleteProduct(id: bigint) {
    try {

        // Use Prisma to delete the invoice
        await prisma.api_product.delete({
            where: { id: id },
        });

        // Revalidate the path after deletion
        revalidatePath('/dashboard');
    } catch (error) {
        console.error('Error deleting invoice:', error);
        throw new Error('Failed to delete the invoice');
    } finally {
        await prisma.$disconnect();  // Disconnect Prisma after the query
    }
}

export async function updateProduct(id: bigint, number: string, qty: number) {
    try {
        await prisma.api_product.update({
            where: { id },
            data: {
                number: number,        // Updated field names
                qty: qty,
            },
        });
    } catch (error) {
        throw new Error('Database Error: Failed to Update Invoice.');
    } finally {
        await prisma.$disconnect();
    }
}

export async function createProduct(number: string, qty: number): Promise<void> {
    try {
        await prisma.api_product.create({
            data: {
                number: number,
                qty: qty,
                date: new Date(),
            },
        });
    } catch (error) {
        throw new Error('Database Error: Failed to Create Invoice.');
    } finally {
        await prisma.$disconnect();
    }
}