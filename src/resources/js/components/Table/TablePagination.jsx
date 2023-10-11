import React from "react";
import calculatePageRange from "../../helpers/calculatePageRange";

export default function TablePagination({ pagination, handlePageChange }) {
    return (
        <nav className="mt-3">
            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <button
                        className={`page-link ${
                            pagination.current_page === 1 ? "disabled" : ""
                        }`}
                        aria-label="Previous"
                        disabled={pagination.current_page === 1}
                        onClick={() =>
                            handlePageChange(
                                pagination.current_page === 1
                                    ? pagination.current_page
                                    : pagination.current_page - 1
                            )
                        }
                    >
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                    </button>
                </li>
                {calculatePageRange(pagination).map((page) => (
                    <li
                        key={page}
                        className={`page-item ${
                            page === pagination.current_page ? "active" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
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
                            pagination.current_page === pagination.last_page
                        }
                        onClick={() =>
                            handlePageChange(
                                pagination.last_page === pagination.current_page
                                    ? pagination.current_page
                                    : pagination.current_page + 1
                            )
                        }
                    >
                        <span aria-hidden="true">&raquo;</span>
                        <span className="sr-only">Next</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}; 
