import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useBookContext } from "../context/context";
import CreateBook from "../components/CreateBook";
import ExportBooks from "../components/ExportBooks";
import TableBooks from "../components/TableBooks";
import SearchBar from "../components/Search/SearchBar";

export default function Home() {
    const apiUrl = process.env.MIX_APP_URL;
    const { state, dispatch } = useBookContext();
    const { page, sortField, sortOrder, searchQuery, books } = state;

    const toastOptions = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    };

    useEffect(() => {
        refreshBooks(page, sortField, sortOrder, searchQuery);
    }, [page]);

    const handleSortChange = ({ field, order }) => {
        dispatch({
            type: "SET_SORT",
            payload: { field: field, order: order },
        });
        refreshBooks(page, field, order, searchQuery);
    };

    const handleSearchChange = (searchQuery) => {
        dispatch({ type: "SET_SEARCH_QUERY", payload: searchQuery });
        refreshBooks(1, sortField, sortOrder, searchQuery);
    };

    const refreshBooks = async (page, sortField, sortOrder, searchQuery) => {
        toast.loading("Loading data...", { toastId: "loading" });
        try {
            const response = await axios.get(`${apiUrl}/book`, {
                params: {
                    page: page,
                    sort_by: sortField,
                    sort_order: sortOrder,
                    search: searchQuery,
                },
            });

            const { data } = response;
            const { data: booksData, ...paginationData } = data;

            dispatch({ type: "SET_BOOKS", payload: booksData });
            dispatch({ type: "SET_PAGINATION", payload: paginationData });

            toast.update("loading", {
                render: "Data has been updated",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                closeOnClick: true,
                theme: "light",
            });
        } catch (error) {
            toast.error("Error: Could not fetch books", toastOptions);
        }
    };

    return (
        <>
            <CreateBook
                url={apiUrl}
                toastOptions={toastOptions}
                onBookAdded={() => refreshBooks(page)}
            />
            {
                books.length === 0 ? (searchQuery ? <SearchBar onSearchSubmit={handleSearchChange}/> : null) :
                    <SearchBar onSearchSubmit={handleSearchChange}/>
            }
            <TableBooks
                url={apiUrl}
                toastOptions={toastOptions}
                onBookUpdate={() => refreshBooks(page)}
                onSortChange={handleSortChange}
            />
            {
                books.length === 0 ? null : <ExportBooks/>
            }
        </>
    );
}
