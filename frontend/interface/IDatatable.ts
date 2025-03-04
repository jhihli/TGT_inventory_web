export interface Product {
    id: bigint | string;
    number: string;
    barcode: string;
    qty: number;
    date: string;
    vender: string;
    client: string;
    category: string;
}

export type User = {
    id: bigint | string;
    password: string;
    last_login: string;
    is_speruser: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: string;
    is_active: string;
    date_joined: string;
    role: string;

}

