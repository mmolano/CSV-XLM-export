import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toast } from "react-toastify";
import { updateBook } from "../../store/axiosCalls";
import { useBookContext } from "../../context/context";

export default function EditModal({ url, toastOptions, hasUpdate }) {
    const {
        state: { rowEditId: id },
    } = useBookContext();
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDisable = () => {
        return !author || isSubmitting;
    };

    const update = async (e) => {
        e.preventDefault();
        if (!author || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("author", author);

            await updateBook(id, url, formData).then((response) => {
                toast.success(response.message, toastOptions);
            });
        } catch (error) {
            toast.error(error.message, toastOptions);
        } finally {
            setAuthor("");
            hasUpdate();
            setIsSubmitting(false);
        }
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
                        <Form onSubmit={update}>
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
