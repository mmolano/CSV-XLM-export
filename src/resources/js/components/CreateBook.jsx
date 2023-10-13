import React, { useState } from "react";
import { toast } from "react-toastify";
import { createBook } from "../store/axiosCalls";
import BookForm from "./Form/BookForm";

export default function CreateBook({ url, toastOptions, onBookAdded }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
    };

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

            await createBook(url, formData).then((response) => {
                toast.success(response.data.message, toastOptions);
                onBookAdded();
            });
        } catch (error) {
            toast.error(error.message, toastOptions);
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
                                <BookForm
                                    title={title}
                                    author={author}
                                    onTitleChange={handleTitleChange}
                                    onAuthorChange={handleAuthorChange}
                                    onSubmit={addBook}
                                    isSubmitting={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
