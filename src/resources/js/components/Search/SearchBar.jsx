import React, { useState } from "react";

export default function SearchBar({ onSearchSubmit }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearchSubmit(searchQuery);
    };
    return (
        <div data-id="cy-search" className="container mt-5">
            <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
                <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                >
                    Search
                </button>
            </form>
        </div>
    );
}
