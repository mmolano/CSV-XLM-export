import React, { createContext, useContext, useReducer } from "react";

const BookContext = createContext();

const initialState = {
    books: [],
    pagination: {},
    page: 1,
    rowEditId: null,
    rowDeleteId: null,
    sortField: "",
    sortOrder: "",
    searchQuery: "",
};

const bookReducer = (state, action) => {
    switch (action.type) {
        case "SET_BOOKS":
            return { ...state, books: action.payload };
        case "SET_PAGINATION":
            return { ...state, pagination: action.payload };
        case "SET_PAGE":
            return { ...state, page: action.payload };
        case "SET_ROW_EDIT_ID":
            return { ...state, rowEditId: action.payload };
        case "SET_ROW_DELETE_ID":
            return { ...state, rowDeleteId: action.payload };
        case "SET_SORT":
            return {
                ...state,
                sortField: action.payload.field,
                sortOrder: action.payload.order,
            };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
};

export const BookProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookReducer, initialState);

    return (
        <BookContext.Provider value={{ state, dispatch }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBookContext = () => {
    return useContext(BookContext);
};
