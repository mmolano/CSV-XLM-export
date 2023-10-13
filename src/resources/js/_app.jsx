import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { BookProvider } from "./context/context";
import Home from "./views/Home";

import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("_app");
const root = createRoot(container);

root.render(
    <StrictMode>
        <BookProvider>
            <Home />
            <ToastContainer
                limit={5}
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                theme="light"
            />
        </BookProvider>
    </StrictMode>
);
