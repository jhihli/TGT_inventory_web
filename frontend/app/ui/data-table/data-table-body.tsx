

import React from "react";
import { Product } from "@/interface/IDatatable";



interface DataTableBodyProps {
    products: Product[];
}

const DataTableBody: React.FC<DataTableBodyProps> = ({ products }) => {
    return (
        <tbody>
            {products.map((product) => (
                <tr key={product.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.number}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.qty}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.date}</td>
                </tr>
            ))}
        </tbody>
    );
};

export default DataTableBody;
