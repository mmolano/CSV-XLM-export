import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateBook({ onBookAdded, toastOptions, url }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleDisable() {
        return !title || !author || isSubmitting;
    }

    const addBook = async (e) => {
        e.preventDefault();
        if (!title || !author || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("author", author);

            setTitle("");
            setAuthor("");

            const response = await axios.post(
                url + `/book`,
                formData
            );

            onBookAdded();
            toast.success(response.data.message, toastOptions);
        } catch (error) {
            if (error.status === 500) {
                toast.error(error.data.message, toastOptions);
            } else {
                toast.error(
                    "An error occured while adding a new book, please contact the administrator",
                    toastOptions
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Add Book</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form onSubmit={addBook}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Name">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={title}
                                                    onChange={(event) => {
                                                        setTitle(
                                                            event.target.value
                                                        );
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Description">
                                                <Form.Label>Author</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={author}
                                                    onChange={(event) => {
                                                        setAuthor(
                                                            event.target.value
                                                        );
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
                                        {isSubmitting ? "Sending" : "Add"}
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
