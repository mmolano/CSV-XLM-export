import axios from "axios";
import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import CreateBook from "../components/CreateBook";
import List from "../components/List";
import ExportSelection from "../components/ExportSelection";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const apiUrl = process.env.MIX_APP_URL;

    const [books, setBooks] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [page, setPage] = useState(1);

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
        refreshBooks(page);
    }, [page]);

     const handlePageChange = (page) => {
         setPage(page);
     };

    const refreshBooks = async (page) => {
        toast.loading("Loading data...", { toastId: "loading" });
        try {
            await axios.get(`${apiUrl}/book?page=${page}`).then(({ data }) => {
                const { data: booksData, ...paginationData } = data;
                setBooks(booksData);
                setPagination(paginationData);
                toast.update("loading", {
                    render: "Data has been updated",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                    closeOnClick: true,
                    theme: "light",
                });
            });
        } catch (error) {
            toast.error("Error: Could not fetch books", toastOptions);
        }
    };

    return (
        <>
            <CreateBook
                onBookAdded={() => refreshBooks(page)}
                toastOptions={toastOptions}
                url={apiUrl}
            />
            <List
                onBookUpdate={() => refreshBooks(page)}
                books={books}
                pagination={pagination}
                toastOptions={toastOptions}
                url={apiUrl}
                onPageChange={handlePageChange}
            />
            <ExportSelection url={apiUrl} />
        </>
    );
}

const container = document.getElementById("home");
const root = createRoot(container);
root.render(
    <StrictMode>
        <Home />
        <ToastContainer
            limit={5}
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            theme="light"
        />
    </StrictMode>
);
