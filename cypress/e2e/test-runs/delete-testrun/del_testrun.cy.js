describe('delete test run', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com', 'Admin@123')
    //cy.visit("http://localhost:3000/test-run");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-run`);
  });
  it('CCA-T-167 (Verify that the user can delete selected Test Runs.)', () => {
    cy.get('[data-cy="testrun-table-deleteicon2"]').click({ force: true });
    cy.get('[data-cy="project-del--btn"]').click();
  });
  it('no keep the test run button', () => {
    cy.get('[data-cy="testrun-table-deleteicon2"]').click({ force: true });
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });
});
