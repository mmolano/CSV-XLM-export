import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function ExportSelection({ url }) {
    const [selectionType, setSelectionType] = useState([]);
    const [selectionFormat, setSelectionFormat] = useState([]);

    const handleCheckboxChangeType = (event) => {
       const checkboxId = event.target.id;
       const isChecked = event.target.checked;

       setSelectionType((prevSelectionType) => {
           if (isChecked) {
               return [...prevSelectionType, checkboxId];
           } else {
               return prevSelectionType.filter((id) => id !== checkboxId);
           }
       });
    };

    const handleCheckboxChangeFormat = (event) => {
        const checkboxId = event.target.id;
        const isChecked = event.target.checked;

        setSelectionFormat((prevSelectionFormat) => {
            if (isChecked) {
                return [...prevSelectionFormat, checkboxId];
            } else {
                return prevSelectionFormat.filter((id) => id !== checkboxId);
            }
        });
    };

   const exportData = async (e) => {
       // TODO: fix reset box.
        e.preventDefault();
        e.target.reset();

        const type = selectionType.join(",");
        const format = selectionFormat.join(",");

        const url = `/export/${type}/${format}`;

        window.open(url, "_blank");

        setSelectionType([]);
        setSelectionFormat([]);
    };
    return (
        <>
            <div className="container mt-5">
                <Form onSubmit={exportData}>
                    <h3>Select data to extract</h3>
                    <div className="form-check">
                        <Form.Check
                            type={"checkbox"}
                            id={`title`}
                            label={`Title`}
                            onChange={handleCheckboxChangeType}
                        />
                    </div>
                    <div className="form-check">
                        <Form.Check
                            type={"checkbox"}
                            id={`author`}
                            label={`Author`}
                            onChange={handleCheckboxChangeType}
                        />
                    </div>
                    <hr />
                    <h3>Select Format</h3>
                    <div className="form-check">
                        <Form.Check
                            type={"checkbox"}
                            id={`csv`}
                            label={`CSV`}
                            onChange={handleCheckboxChangeFormat}
                        />
                    </div>
                    <div className="form-check">
                        <Form.Check
                            type={"checkbox"}
                            id={`xml`}
                            label={`XML`}
                            onChange={handleCheckboxChangeFormat}
                        />
                    </div>
                    <Button
                        variant="primary"
                        className="mt-2"
                        size="lg"
                        block="block"
                        type="submit"
                    >
                        Download
                    </Button>
                </Form>
            </div>
        </>
    );
}
