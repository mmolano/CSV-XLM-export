import axios from "../config/axiosConfig";

export async function getAllBooks(url, page, sortField, sortOrder, searchQuery) {
   try {
      return await axios.get(`${url}/book`, {
         params: {
            page: page,
            sort_by: sortField,
            sort_order: sortOrder,
            search: searchQuery,
         },
      });
   } catch (error) {
      throw error.response.data;
   }
}

export async function createBook(url, data) {
   try {
      return await axios.post(`${url}/book`, data);
   } catch (error) {
      throw error.response.data;
   }
}

export async function updateBook(id, url, data) {
   try {
      const response = await axios.patch(`${url}/book/${id}`, data);
      return response.data;
   } catch (error) {
      throw error.response.data;
   }
}

export async function deleteBook(id, url) {
   try {
      const response = await axios.delete(`${url}/book/${id}`);
      return response.data;
   } catch (error) {
      throw error.response.data;
   }
}