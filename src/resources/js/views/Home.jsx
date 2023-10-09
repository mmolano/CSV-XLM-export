import React, { useEffect, useState } from "react";
import List from "../components/List";
import { StrictMode } from "react";
import CreateBook from "../components/CreateBook";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const apiUrl = process.env.MIX_APP_URL;

    const [books, setBooks] = useState([]);

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
        refreshBooks();
    }, []);

    const refreshBooks = async () => {
        toast.loading("Loading data...", { toastId: "loading" });
        try {
            await axios.get(apiUrl + `/book`).then(({ data }) => {
                setBooks(data);
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
            console.error("Error fetching books:", error);
        }
    };

    return (
        <>
            <CreateBook
                onBookAdded={() => refreshBooks()}
                toastOptions={toastOptions}
                url={apiUrl}
            />
            ;
            <List onBookDelete={() => refreshBooks()} books={books} toastOptions={toastOptions} url={apiUrl} />;
        </>
    );
};

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
