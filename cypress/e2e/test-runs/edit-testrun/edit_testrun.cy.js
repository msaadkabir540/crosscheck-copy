describe('edit test run', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com', 'Admin@123')

    // cy.visit("http://localhost:3000/test-run");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-run`);
    //cy.url('http://localhost:3000/').should('eq', 'http://localhost:3000/');
  });
  it('CCA-T-168,CCA-T-169 (the user can edit the details of an existing Test Run)', () => {
    cy.get('[data-cy="testrun-table-editicon1"]').click({ force: true });
    cy.get('[data-cy="testrun-modal-runtitle"]').clear().type('testing');
    cy.get('[data-cy="testrun-modal-description"]').clear().type('helloworld');
    cy.get('#testrun-modal-datepicker').click().clear().type('15/02/2023{enter}');
    cy.get('[data-cy="testrun-modal-priority"]').type('Low{enter}');
    cy.get('[data-cy="testrun-modal-assignee"]').type('aiza amir{enter}');
    cy.get('[data-cy="testrun-modal-save-btn"]').click();
  });
});
