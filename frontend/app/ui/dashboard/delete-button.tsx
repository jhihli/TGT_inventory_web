'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProducts } from '@/app/lib/actions';
import { useDeleteMessage } from './table';

export function DeleteButton() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { setDeleteMessage } = useDeleteMessage();

  // Function to safely update selectedCount from localStorage
  const updateSelectedCount = () => {
    try {
      const storedItems = localStorage.getItem('selectedProductIds');
      let selectedItems = [];

      // Handle null or undefined
      if (!storedItems) {
        localStorage.setItem('selectedProductIds', '[]'); // Reset to empty array
        setSelectedCount(0);
        return;
      }

      // Parse JSON, default to empty array if invalid
      try {
        selectedItems = JSON.parse(storedItems);
      } catch (parseError) {
        console.error('Error parsing selected items:', parseError);
        localStorage.setItem('selectedProductIds', '[]'); // Reset to empty array
        setSelectedCount(0);
        return;
      }

      // Ensure selectedItems is an array
      if (!Array.isArray(selectedItems)) {
        console.warn('Selected items is not an array, resetting to empty array');
        localStorage.setItem('selectedProductIds', '[]');
        setSelectedCount(0);
        return;
      }

      // Set count based on valid array length
      const count = selectedItems.length || 0;
      setSelectedCount(count);
    } catch (error) {
      console.error('Error updating selected count:', error);
      setSelectedCount(0);
      localStorage.setItem('selectedProductIds', '[]'); // Reset as a safety measure
    }
  };

  // Listen for changes in selected items
  useEffect(() => {
    // Initial count
    updateSelectedCount();

    // Listen for storage events (e.g., from other tabs)
    const handleStorageChange = () => {
      updateSelectedCount();
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events
    const handleSelectedItemsChanged = () => {
      updateSelectedCount();
    };
    window.addEventListener('selectedItemsChanged', handleSelectedItemsChanged);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('selectedItemsChanged', handleSelectedItemsChanged);
    };
  }, []);

  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    setIsDeleting(true);

    try {
      const storedItems = localStorage.getItem('selectedProductIds');
      let selectedIds = [];

      // Safely parse and validate selectedIds
      if (!storedItems) {
        setIsDeleting(false);
        return;
      }

      try {
        selectedIds = JSON.parse(storedItems);
      } catch (parseError) {
        console.error('Error parsing selected IDs for deletion:', parseError);
        setDeleteMessage('Invalid selection data, please try again');
        setIsDeleting(false);
        return;
      }

      if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        setIsDeleting(false);
        return;
      }

      const result = await deleteProducts(selectedIds);

      if (result.success) {
        // Clear selected items in localStorage
        localStorage.setItem('selectedProductIds', '[]');

        // Dispatch selectedItemsChanged event to notify other components
        // ProductsTable will listen selectedItemsChanged event
        const event = new CustomEvent('selectedItemsChanged', {
          detail: { source: 'deleteButton' }
        });
        window.dispatchEvent(event);

        // Show success message
        setDeleteMessage(result.message);

    
        // 強制重新整理當前頁面
        router.refresh();
      } else {
        setDeleteMessage(result.message);
      }
    } catch (error) {
      console.error('Failed to delete products:', error);
      setDeleteMessage('An unexpected error occurred while deleting products');
    } finally {
      setIsDeleting(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <button
      onClick={handleDeleteSelected}
      disabled={isDeleting}
      className={`flex items-center gap-2 rounded-md ${
        isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
      } px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
      title={`Delete Selected (${selectedCount})`}
    >
      {isDeleting ? (
        <>
          <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete Selected ({selectedCount})</span>
        </>
      )}
    </button>
  );
}