import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteModal from "../components/Elements/DeleteModal";
import { toast } from "react-toastify";

export default function List({ books, toastOptions, onBookDelete, url }) {
    const [rowId, setRowId] = useState(null);

    const removeRow = async () => {
        if (rowId) {
            await axios
                .delete(url + `/book/${rowId}`)
                .then(({ data }) => {
                    toast.success(data.message, toastOptions);
                    onBookDelete();
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
            <div className="container">
                <h2 className="mt-2 text-center">
                    Available books: {books.length}
                </h2>
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
                                                    <a
                                                        href="#"
                                                        className="btn btn-success me-2"
                                                    >
                                                        Edit
                                                    </a>
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
