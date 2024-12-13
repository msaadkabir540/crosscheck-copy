describe('delete bug and scenarios', () => {
  //    console.log(Cypress.env());

  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.intercept({
      url: '**/unique-tested-devices',
      method: 'GET',
    }).as('bugreport');

    cy.wait('@bugreport');
  });
  it('delete the bug,', () => {
    cy.get('[data-cy="bugreporting-del-icon2"]').click({ force: true });
    cy.get('[data-cy="project-del--btn"]').click();
  });
  it('no keep it ,', () => {
    cy.get('[data-cy="bugreporting-del-icon2"]').click({ force: true });
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });
});
