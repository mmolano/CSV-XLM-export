import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function BookForm({
    title,
    author,
    onTitleChange,
    onAuthorChange,
    onSubmit,
    isSubmitting,
}) {
    const handleDisable = () => !title || !author || isSubmitting;

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col>
                    <Form.Group controlId="titleAdd">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={onTitleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <Form.Group controlId="authorAdd">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            type="text"
                            value={author}
                            onChange={onAuthorChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Button
                id="cy-add-button"
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
    );
}
