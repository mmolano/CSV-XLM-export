import React from "react";
import { toast } from "react-toastify";
import { useBookContext } from "../context/context";
import DeleteModal from "./Modal/DeleteModal";
import EditModal from "./Modal/EditModal";
import TableBody from "./Table/TableBody";
import TablePagination from "./Table/TablePagination";

export default function TableBooks({
                                       url,
                                       toastOptions,
                                       onBookUpdate,
                                       onSortChange,
                                   }) {
    const { state, dispatch } = useBookContext();
    const { sortField, sortOrder, rowDeleteId, pagination, books } = state;

    const handleSort = (field) => {
        let newSortOrder;

        if (field === sortField) {
            newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            newSortOrder = "asc";
        }
        onSortChange({ field, order: newSortOrder });
    };

    const handlePageChange = (page) => {
        dispatch({ type: "SET_PAGE", payload: page });
    };

    return (
        <>
            <DeleteModal url={url}
                         toastOptions={toastOptions}
                         hasUpdate={() => onBookUpdate()}
            />
            <EditModal
                url={url}
                toastOptions={toastOptions}
                hasUpdate={() => onBookUpdate()}
            />
            <div className="container">
                <h2 className="mt-2 text-center">
                    Available books: {pagination.total ? pagination.total : 0}{" "}
                    {books.length === 0 ? null : `and ${pagination.last_page ? pagination.last_page : 0} pages`}
                </h2>
                <h5>Showing {books.length} books</h5>
                {books.length === 0 ? (
                    "No books found"
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <div className="card card-body">
                                <TableBody
                                    books={books}
                                    sortField={sortField}
                                    sortOrder={sortOrder}
                                    handleSort={handleSort}
                                />
                                <TablePagination
                                    pagination={pagination}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
