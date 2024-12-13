describe('delete test case ', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com','Admin@123')
    //cy.visit("http://localhost:3000/test-cases");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
  });
  it('no keep this button', () => {
    cy.get('[data-cy="addtestcasepage-del3"]').click({ force: true });
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });
  it('CCA-T-82,test case del btn', () => {
    cy.get('[data-cy="addtestcasepage-del3"]').click({ force: true });
    cy.get('[data-cy="project-del--btn"]').click();
    cy.get('.Toastify').should('contain', 'successfully');
  });
});
