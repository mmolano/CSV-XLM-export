// check commands.js for unrecognized functions
const targetUrl = Cypress.env('CYPRESS_TARGET_URL');

describe('User experience testing | Data behaviour', () => {
    it('Visits the website and get error on DB fetch', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { statusCode: 400 }).as('fail');
        cy.visit(targetUrl);

        cy.wait('@fail').then(() => {
            cy.get('#cy-error-get-books', { timeout: 10000 }).should('have.contain', 'Error: Could not fetch books');
            cy.checkComponentsNotVisible();
        });
    });

    it('Visits the website and verifies UI components (SearchBar, TableBooks, ExportBooks) for an empty DB', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'emptyDatabase.json' }).as('emptyDB');
        cy.visit(targetUrl);

        cy.wait('@emptyDB').then(() => {
            cy.checkComponentsNotVisible();
        });
    });

    it('Visits the website and verifies UI components with data', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.get('[data-id="cy-table"] h2', { timeout: 10000 }).should('have.contain', 'Available books: 3');
            cy.get('[data-id="cy-table-item-title-1"]', { timeout: 10000 }).should('have.contain', 'Test Title 1');
            cy.get('[data-id="cy-table-item-title-2"]', { timeout: 10000 }).should('have.contain', 'Test Title 2');
            cy.get('[data-id="cy-table-item-title-3"]', { timeout: 10000 }).should('have.contain', 'Test Title 3');
        });
    });

    it('Visits the website and delete one user', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.intercept('DELETE', '/api/book/1', {
                statusCode: 200,
                body: {
                    message: 'The book has been deleted'
                },
            }).as('deleteRequest');

            cy.get('td button[data-target="#deleteModal"]', { timeout: 10000 })
                .first()
                .should('have.contain', 'Delete')
                .click()
                .then(() => {
                    cy.intercept('GET', '/api/book?page=1', { fixture: 'afterDelete.json' }).as('getBooksAfterDelete');

                    cy.get('#deleteModal button.btn-danger', { timeout: 10000 })
                        .click()
                        .wait('@deleteRequest')
                        .then((interception) => {
                            const response = interception.response;
                            expect(response.statusCode).to.equal(200);
                            expect(response.body.message).to.equal('The book has been deleted');
                        });

                    cy.wait('@getBooksAfterDelete').then(() => {
                        cy.get('[data-id="cy-table-item-title-1"]', { timeout: 10000 }).should('not.exist');
                        cy.get('[data-id="cy-table-item-title-2"]', { timeout: 10000 }).should('have.contain', 'Test Title 2');
                        cy.get('[data-id="cy-table-item-title-3"]', { timeout: 10000 }).should('have.contain', 'Test Title 3');
                    });
                });

        });
    });

    it('Visits the website and update one user', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.intercept('POST', '/api/book/2', {
                statusCode: 200,
                body: {
                    message: 'Book author has been updated'
                },
            }).as('updateRequest');

            cy.get('td button[data-target="#editModal"]', { timeout: 10000 })
                .eq(1)
                .should('have.contain', 'Edit')
                .click()
                .then(() => {
                    cy.intercept('GET', '/api/book?page=1', { fixture: 'afterUpdate.json' }).as('getBooksAfterUpdate');

                    cy.get('#editModal input', { timeout: 10000 })
                        .type('Updated Author');

                    cy.get('#editModal button[type="submit"]')
                        .click()
                        .wait('@updateRequest')
                        .then((interception) => {
                            const response = interception.response;
                            expect(response.statusCode).to.equal(200);
                            expect(response.body.message).to.equal('Book author has been updated');
                        });

                    cy.wait('@getBooksAfterUpdate').then(() => {
                        cy.get('[data-id="cy-table-item-title-1"]', { timeout: 10000 }).should('have.contain', 'Test Title 1');
                        cy.get('[data-id="cy-table-item-author-2"]', { timeout: 10000 }).should('have.contain', 'Updated Author');
                        cy.get('[data-id="cy-table-item-title-3"]', { timeout: 10000 }).should('have.contain', 'Test Title 3');
                    });

                    cy.get('#editModal .modal-footer button[data-dismiss="modal"]').click();
                    cy.get('#editModal').should('not.be.visible');
                });

        });
    });

    it('Visits the website and add one user', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.intercept('POST', '/api/book', {
                statusCode: 200,
                body: {
                    message: 'A new book has been added'
                },
            }).as('addRequest');

            cy.intercept('GET', '/api/book?page=1', { fixture: 'afterAdd.json' }).as('getBooksAfterAdd');

            cy.get('td button[data-target="#editModal"]', { timeout: 10000 });
            cy.get('input#titleAdd')
                .type('New Title');

            cy.get('input#authorAdd')
                .type('New Author');

            cy.get('#cy-add-button')
                .click()
                .wait('@addRequest')
                .then((interception) => {
                    const response = interception.response;
                    expect(response.statusCode).to.equal(200);
                    expect(response.body.message).to.equal('A new book has been added');
                });

            cy.wait('@getBooksAfterAdd').then(() => {
                cy.get('[data-id="cy-table-item-title-1"]', { timeout: 10000 }).should('have.contain', 'Test Title 1');
                cy.get('[data-id="cy-table-item-author-2"]', { timeout: 10000 }).should('have.contain', 'Updated Author');
                cy.get('[data-id="cy-table-item-title-3"]', { timeout: 10000 }).should('have.contain', 'Test Title 3');
                cy.get('[data-id="cy-table-item-title-4"]', { timeout: 10000 }).should('have.contain', 'New Title');
                cy.get('[data-id="cy-table-item-author-4"]', { timeout: 10000 }).should('have.contain', 'New Author');
            });

        });
    });

    it('Visits the website and search for title or author', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=Title+1', { fixture: 'afterSearch.json' }).as('getBooksAfterSearch');

            cy.checkComponentsVisible();

            cy.get('[data-id="cy-search"] input')
                .type('Title 1');

            cy.get('[data-id="cy-search"] button')
                .click()

            cy.wait('@getBooksAfterSearch').then(() => {
                cy.get('[data-id="cy-table-item-title-1"]', { timeout: 10000 }).should('have.contain', 'Test Title 1');
                cy.get('[data-id="cy-table-item-title-2"]', { timeout: 10000 }).should('not.exist');
                cy.get('[data-id="cy-table-item-title-3"]', { timeout: 10000 }).should('not.exist');
            });

        });
    });

    it('Visits the website and extract to CSV', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.window().then((win) => {
                cy.stub(win, 'open').as('openStub');
            });

            cy.checkExtractBoxType();

            cy.get('[data-id="cy-export"] input#csv')
                .check();

            cy.get('[data-id="cy-export"] button[type="submit"]')
                .click();

            cy.get('@openStub').should('be.calledWithMatch', Cypress.sinon.match.string, '_blank');
        });
    });

    it('Visits the website and extract to XML', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.window().then((win) => {
                cy.stub(win, 'open').as('openStub');
            });

            cy.checkExtractBoxType();

            cy.get('[data-id="cy-export"] input#xml')
                .check();

            cy.get('[data-id="cy-export"] button[type="submit"]')
                .click();

            cy.get('@openStub').should('be.calledWithMatch', Cypress.sinon.match.string, '_blank');
        });
    });

    it('Visits the website and extract to CSV & XML', () => {
        cy.intercept('GET', '/api/book?page=1&sort_by=&sort_order=&search=', { fixture: 'filledDatabase.json' }).as('getBooks');
        cy.visit(targetUrl);

        cy.wait('@getBooks').then(() => {
            cy.checkComponentsVisible();

            cy.window().then((win) => {
                cy.stub(win, 'open').as('openStub');
            });

            cy.checkExtractBoxType();

            cy.get('[data-id="cy-export"] input#csv')
                .check()

            cy.get('[data-id="cy-export"] input#xml')
                .check()

            cy.get('[data-id="cy-export"] button[type="submit"]')
                .click()

            cy.get('@openStub').should('be.calledWithMatch', Cypress.sinon.match.string, '_blank');
        });
    });
})
