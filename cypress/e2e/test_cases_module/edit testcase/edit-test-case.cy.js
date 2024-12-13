describe('edit testcase ', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com','Admin@123')
    // cy.visit("http://localhost:3000/test-cases");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
  });

  it('CCA-T-85', () => {
    cy.get('[data-cy="addtestcasepage-edit-icon1"]').click({ force: true });
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]').type('asdfgh');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('editing the steps');
    cy.get('[data-cy="testcases-testtype-selectbox"]').click().type('Performance Testing{enter}');
    cy.get('[data-cy="testcases-related-test-ID"]').clear().type('AAA-123');
    cy.get('[data-cy="add-testcase-save-btn"]').click();
    cy.get('.Toastify').should('contain', ' Successfully');
  });
});
