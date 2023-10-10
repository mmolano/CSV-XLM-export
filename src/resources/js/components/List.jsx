import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../components/Elements/DeleteModal";
import EditModal from "./Elements/EditModal";

export default function List({
    books,
    pagination,
    toastOptions,
    onBookUpdate,
    onPageChange,
    url,
    onSortChange,
}) {
    const [rowId, setRowId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const maxDisplayedPages = pagination.per_page;

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    const handleSort = (field) => {
        let newSortOrder;

        if (field === sortField) {
            newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            newSortOrder = "asc";
        }

        setSortField(field);
        setSortOrder(newSortOrder);

        onSortChange({ field, order: newSortOrder });
    };

    const removeRow = async () => {
        if (rowId) {
            await axios
                .delete(`${url}/book/${rowId}`)
                .then(({ data }) => {
                    toast.success(data.message, toastOptions);
                    onBookUpdate();
                })
                .catch(({ response }) => {
                    toast.error(response.data.message, toastOptions);
                });
        }
    };

    const calculatePageRange = () => {
        let startPage = Math.max(
            1,
            pagination.current_page - Math.floor(maxDisplayedPages / 2)
        );
        const endPage = Math.min(
            pagination.last_page,
            startPage + maxDisplayedPages - 1
        );

        if (endPage - startPage + 1 < maxDisplayedPages) {
            startPage = Math.max(1, endPage - maxDisplayedPages + 1);
        }

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index
        );
    };

    function removeSelectedId() {
        setRowId(null);
    }

    return (
        <>
            <DeleteModal
                onConfirmDelete={() => removeRow()}
                onCancel={() => removeSelectedId()}
            />
            <EditModal
                id={editId}
                url={url}
                toastOptions={toastOptions}
                hasUpdate={() => onBookUpdate()}
            />
            <div className="container">
                <h2 className="mt-2 text-center">
                    Available books: {pagination.total ? pagination.total : 0}{" "}
                    and {pagination.last_page ? pagination.last_page : 0} pages
                </h2>
                <h5>Showing {books.length} books</h5>
                {books.length === 0 ? (
                    "No books found"
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <div className="card card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered mb-0 text-center">
                                        <thead>
                                            <tr>
                                                <th
                                                    className="sortable-th"
                                                    onClick={() =>
                                                        handleSort("author")
                                                    }
                                                >
                                                    Author&nbsp;
                                                    {sortField === "author" &&
                                                    sortOrder === "asc" ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-caret-down-fill"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                                        </svg>
                                                    ) : null}
                                                    {sortField === "author" &&
                                                    sortOrder === "desc" ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-caret-up-fill"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                        </svg>
                                                    ) : null}
                                                </th>
                                                <th
                                                    className="sortable-th"
                                                    onClick={() =>
                                                        handleSort("title")
                                                    }
                                                >
                                                    Title&nbsp;
                                                    {sortField === "title" &&
                                                    sortOrder === "asc" ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-caret-down-fill"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                                        </svg>
                                                    ) : null}
                                                    {sortField === "title" &&
                                                    sortOrder === "desc" ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-caret-up-fill"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                                        </svg>
                                                    ) : null}
                                                </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {books.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.author}</td>
                                                    <td>{row.title}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success me-2 m-1"
                                                            data-toggle="modal"
                                                            data-target="#editModal"
                                                            onClick={() =>
                                                                setEditId(
                                                                    row.id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-danger me-2 m-1"
                                                            data-toggle="modal"
                                                            data-target="#deleteModal"
                                                            onClick={() =>
                                                                setRowId(row.id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <nav className="mt-3">
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item">
                                            <button
                                                className={`page-link ${
                                                    pagination.current_page ===
                                                    1
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                                aria-label="Previous"
                                                disabled={
                                                    pagination.current_page ===
                                                    1
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.current_page ===
                                                            1
                                                            ? pagination.current_page
                                                            : pagination.current_page -
                                                                  1
                                                    )
                                                }
                                            >
                                                <span aria-hidden="true">
                                                    &laquo;
                                                </span>
                                                <span className="sr-only">
                                                    Previous
                                                </span>
                                            </button>
                                        </li>
                                        {calculatePageRange().map((page) => (
                                            <li
                                                key={page}
                                                className={`page-item ${
                                                    page ===
                                                    pagination.current_page
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}

                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                aria-label="Next"
                                                disabled={
                                                    pagination.current_page ===
                                                    pagination.last_page
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.last_page ===
                                                            pagination.current_page
                                                            ? pagination.current_page
                                                            : pagination.current_page +
                                                                  1
                                                    )
                                                }
                                            >
                                                <span aria-hidden="true">
                                                    &raquo;
                                                </span>
                                                <span className="sr-only">
                                                    Next
                                                </span>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
