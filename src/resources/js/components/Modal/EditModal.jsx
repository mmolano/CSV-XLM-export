import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";
import { useBookContext } from "../../context/context";

export default function EditModal({ url, toastOptions, hasUpdate }) {
    const {
        state: { rowEditId: id },
    } = useBookContext();
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleDisable() {
        return !author || isSubmitting;
    }

    const updateBook = async (e) => {
        e.preventDefault();
        if (!author || isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("author", author);

        await axios
            .post(`${url}/book/${id}`, formData)
            .then(({ data }) => {
                toast.success(data.message, toastOptions);
            })
            .catch(({ response }) => {
                toast.error(response.error, toastOptions);
            })
            .finally(() => {
                setAuthor("");
                hasUpdate();
                setIsSubmitting(false);
            });
    };

    return (
        <div
            className="modal fade"
            id="editModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editModalLabel">
                            Update Book
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
                        <Form onSubmit={updateBook}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="Name">
                                        <Form.Label>Author</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={author}
                                            onChange={(event) => {
                                                setAuthor(event.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button
                                variant="primary"
                                className="mt-2"
                                size="lg"
                                block="block"
                                type="submit"
                                disabled={handleDisable()}
                            >
                                {isSubmitting ? "Updating" : "Update"}
                            </Button>
                        </Form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
