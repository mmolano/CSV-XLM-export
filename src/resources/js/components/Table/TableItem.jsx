import React from "react";
import { useBookContext } from "../../context/context";

export default function TableItem({ id, author, title }) {
    const { dispatch } = useBookContext();

    return (
        <tr>
            <td>{author}</td>
            <td>{title}</td>
            <td>
                <button
                    className="btn btn-success me-2 m-1"
                    data-toggle="modal"
                    data-target="#editModal"
                    onClick={() =>
                        dispatch({ type: "SET_ROW_EDIT_ID", payload: id })
                    }
                >
                    Edit
                </button>
                <button
                    className="btn btn-danger me-2 m-1"
                    data-toggle="modal"
                    data-target="#deleteModal"
                    onClick={() =>
                        dispatch({ type: "SET_ROW_DELETE_ID", payload: id })
                    }
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}; 
