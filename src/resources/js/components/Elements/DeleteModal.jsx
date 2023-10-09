import React from "react";

export default function DeleteModal({ onConfirmDelete, onCancel, title }) {
    function removeRow() {
        onConfirmDelete();
    }

    function cancel() {
        onCancel();
    }

    return (
        <div
            className="modal fade"
            id="deleteModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="deleteModalLabel">
                            Delete Book
                        </h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        Would you like to delete this entry?
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={() => cancel()}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                            onClick={() => removeRow()}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
