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
    url,
}) {
    const [rowId, setRowId] = useState(null);
    const [editId, setEditId] = useState(null);

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
                    Available books: {pagination.total}
                </h2>
                <h5>Showing {books.length} books</h5>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered mb-0 text-center">
                                    <thead>
                                        <tr>
                                            <th>Author</th>
                                            <th>Title</th>
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
                                                        className="btn btn-success me-2"
                                                        data-toggle="modal"
                                                        data-target="#editModal"
                                                        onClick={() =>
                                                            setEditId(row.id)
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger me-2"
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
