// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('checkComponentsNotVisible', () => {
    cy.get('[data-id="cy-export"]', { timeout: 10000 }).should('not.exist');
    cy.get('[data-id="cy-search"]', { timeout: 10000 }).should('not.exist');
    cy.get('[data-id="cy-table-body"]', { timeout: 10000 }).should('not.exist');

    cy.get('[data-id="cy-table"] h2', { timeout: 10000 }).should('have.contain', 'Available books: 0')
});

Cypress.Commands.add('checkComponentsVisible', () => {
    cy.get('[data-id="cy-export"]', { timeout: 10000 }).should('exist');
    cy.get('[data-id="cy-search"]', { timeout: 10000 }).should('exist');
    cy.get('[data-id="cy-table-body"]', { timeout: 10000 }).should('exist');
});

Cypress.Commands.add('checkExtractBoxType', () => {
    cy.get('[data-id="cy-export"] input#title')
        .check();

    cy.get('[data-id="cy-export"] input#author')
        .check();
});


//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
