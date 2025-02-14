// import { Product } from '@/interface/IDatatable';


// export async function getProducts(): Promise<Product[]> {
//     const API_URL = process.env.NEXT_PUBLIC_Django_API_URL;
//     try {
//         const userResponse = await fetch(API_URL + "/product/products", {
//             method: "GET",
//             //   headers: {
//             //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             //   },
//         });
//         const userData = await userResponse.json();
//         return userData.items;
//     } catch (error) {
//         console.error("Unexpected error:", error);
//         return [];
//     }
// }

// export interface EventCategoriesType {
//     id: number;
//     name: string;
// }

// export async function getEventsCategories(): Promise<EventCategoriesType[]> {
//     const API_URL = process.env.NEXT_PUBLIC_Django_API_URL;
//     try {
//         const userResponse = await fetch(API_URL + "events/categories", {
//             method: "GET",
//         });
//         const userData = await userResponse.json();
//         console.log("getEventcategories:", userData);
//         return userData;
//     } catch (error) {
//         console.error("Unexpected error:", error);
//         return [];
//     }
// }



// useEffect(() => {
//     const fetchEvents = async () => {
//       const data = await getEvents();
//       setEvents(data);
//     };
//     const fetchEventsCategories = async () => {
//       const categorie = await getEventsCategories();
//       setCategories(categorie);
//     };
//     fetchEvents();
//     fetchEventsCategories();
//   }, []);

//   useEffect(() => {
//     console.log("events :", events);
//     console.log("cagtegories :", categories);
//   }, [events, categories]);