describe('report a bug from failed testcase ', { defaultCommandTimeout: 9000 }, () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com', 'Admin@123')
    // cy.visit("http://localhost:3000/test-cases");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
    cy.intercept({
      url: '**/my-workspaces',
      method: 'GET',
    }).as('testcasepage');
    cy.wait('@testcasepage');
  });
  it('CCA-T-2011 (Access to Test Case Testing Modal and verify that the user can access the test case testing modal by clicking on the test case status tag.)', () => {
    cy.get('[data-cy="testcase-table-id1"]').click();
    cy.get('[data-cy="status-click-viewtestcase"]').click();
    cy.get('[data-cy="testStatus"]').type('Failed{enter}');
    cy.get('[data-cy="test-evidence-testcse-status-modal"]').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('[data-cy="tested-version-status-testcase"]').type('1.41');
    cy.get('[data-cy="tested-env-status-testcase"]').type('staging{enter}');
    cy.get('[data-cy="tested-device-status-testcase"]').type('laptop{enter}');
    cy.get('[data-cy="notes-status-testcase"]').type('THIS IS THE NOTES');
    cy.get('[data-cy="save-test-fail-testcase-Btn"]').click();
    cy.get('[data-cy="testcase-reportabug-btn"]').click();
  });
  //     it('report a bug from failed testcase', () => {
  //         cy.get('[data-cy="uploadfile-bugreport"]').click()
  //         cy.get('[data-cy="status-click-viewtestcase"]').click()
  //         cy.get('[data-cy="viewtestcase-statuschange-selectbox"]').click().type('failed{enter}')
  //         cy.get('[data-cy="viewtestcase-statuschange-submit-btn"]').click({ force: true })
  //         cy.get(".remove-confirm-modal_iconRefresh__EoOPZ").should("be.visible")
  //

  //     })
});
