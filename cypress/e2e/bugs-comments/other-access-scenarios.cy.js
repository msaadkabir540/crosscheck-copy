describe('bugs comments', () => {
  // beforeEach(() => {
  //     console.log(Cypress.env());
  //     cy.login('laiba.javaid@sprintx.net', 'Admin@123')
  //     cy.visit("http://localhost:3000/qa-testing");

  //     cy.intercept({
  //         url: "**/unique-tested-devices",
  //         method: "GET"
  //     }).as("bugreport")

  //     cy.wait("@bugreport")
  // })
  it('CCA-T-1836(Edit and Delete Access for Commenter and verify that the Edit and Delete options for a comment are only available to the commenter.)', () => {
    cy.login('laiba.javaid@sprintx.net', 'Admin@123');
    cy.visit('http://localhost:3000/qa-testing');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="edit-comentbugs3"]').should('not.exist');
  });
  it('CCA-T-1837(Delete Access for Admin and Owner and verify that Admin and Owner have access to delete anyone comment))', () => {
    cy.login('saad.baig@sprintx.net', 'Admin@123');
    cy.visit('http://localhost:3000/qa-testing');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="del-adminComentbugs4"]').click({ force: true });
    cy.get('[data-cy="project-del--btn"]').click();
  });
});
