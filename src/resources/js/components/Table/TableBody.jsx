import React from "react";
import TableItem from "./TableItem";

export default function TableBody({ books, sortField, sortOrder, handleSort }) {
    return (
        <div data-id="cy-table-body" className="table-responsive">
            <table className="table table-bordered mb-0 text-center">
                <thead>
                    <tr>
                        <th
                            className="sortable-th"
                            onClick={() => handleSort("title")}
                        >
                            Title&nbsp;
                        </th>
                        <th
                            className="sortable-th"
                            onClick={() => handleSort("author")}
                        >
                            Author&nbsp;
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((row, index) => (
                        <TableItem
                            key={index}
                            id={row.id}
                            title={row.title}
                            author={row.author}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
