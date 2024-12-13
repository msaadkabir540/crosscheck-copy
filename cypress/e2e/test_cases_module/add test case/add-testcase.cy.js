import 'cypress-real-events/support';

describe('Add Test Case', () => {
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
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="addtestcase-btn"]').click();
  });
  it('CCA-T-1381(Adding New Test Cases and verify that all new test cases are added with the "active" state. )', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat1{enter}');
    cy.get('[data-cy="add-test-case-btn-for-modal"]').click();
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]').type('testing the objective');
    cy.get('[data-cy="testcases-txteditor-preconditionspreConditions"]').type('testing the preconditions');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('testing the test steps');
    cy.get('[data-cy="testcases-txteditor-expectedresultexpectedResults"]').type('testing the expected result');
    cy.get('#points').invoke('val', '3', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="testcases-testtype-selectbox"]').click().type('UI Testing{enter}');
    cy.get('[data-cy="testcases-related-test-ID"]').type('CCA-A-123');
    cy.get('[data-cy="add-testcase-save-btn"]').click();
    cy.get('.Toastify').should('contain', 'Added Successfully');
  });

  it('CCA-T-73 (Test case should be added with an auto-generated Test Case ID.)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat2{enter}');
    cy.get('[data-cy="add-test-case-btn-for-modal"]').click();
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]').type('testing the objective');
    cy.get('[data-cy="testcases-txteditor-preconditionspreConditions"]').type('testing the preconditions');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('testing the test steps');
    cy.get('[data-cy="testcases-txteditor-expectedresultexpectedResults"]').type('testing the expected result');
    cy.get('#points').invoke('val', 6).trigger('change');
    cy.get('[data-cy="testcases-testtype-selectbox"]').click().type('UI Testing{enter}');
    cy.get('[data-cy="testcases-related-test-ID"]').type('CCA-A-123');
    cy.get('[data-cy="add-testcase-save-btn"]').click().should('contain', 'Save');
    cy.get('.Toastify').should('contain', 'Added Successfully');
  });
  it('CCA-T-74(Test case should be added, and the form should remain open)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat2{enter}');
    cy.get('[data-cy="add-test-case-btn-for-modal"]').click();
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]').type('testing the objective');
    cy.get('[data-cy="testcases-txteditor-preconditionspreConditions"]').type('testing the preconditions');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('testing the test steps');
    cy.get('[data-cy="testcases-txteditor-expectedresultexpectedResults"]').type('testing the expected result');
    cy.get('#points').invoke('val', '3', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="testcases-testtype-selectbox"]').click().type('UI Testing{enter}');
    cy.get('[data-cy="testcases-related-test-ID"]').type('CCA-A-123');
    cy.get('[data-cy="add-testcase-checkbox-addanother"]').click();
    cy.get('[data-cy="add-testcase-save-btn"]').should('contain', 'Save');
  });

  it('CCA-T-72(The table should display test cases of the selected Project, Milestone, and Feature)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('testing1{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat1{enter}');
  });

  it('CCA-T-76( a user cannot add a test case without filling in mandatory fields.)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat2{enter}');
    cy.get('[data-cy="add-test-case-btn-for-modal"]').click();
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]');
    cy.get('[data-cy="testcases-txteditor-preconditionspreConditions"]').type('testing the preconditions');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('testing the test steps');
    cy.get('[data-cy="testcases-txteditor-expectedresultexpectedResults"]');
    cy.get('#points').invoke('val', '3', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="testcases-testtype-selectbox"]').click();
    cy.get('[data-cy="testcases-related-test-ID"]').type('CCA-A-123');
    cy.get('[data-cy="add-testcase-checkbox-addanother"]').click();
    cy.get('[data-cy="add-testcase-save-btn"]').click().should('contain', 'Save');
  });

  it('CCA-T-77(cannot add a test case if no mandatory fields are filled.)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat2{enter}');
    cy.get('[data-cy="add-test-case-btn-for-modal"]').click();
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]').type('testing the objective');
    cy.get('[data-cy="testcases-txteditor-preconditionspreConditions"]').type('testing the preconditions');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('testing the test steps');
    cy.get('[data-cy="testcases-txteditor-expectedresultexpectedResults"]').type('testing the expected result');
    cy.get('#points').invoke('val', '3', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="testcases-testtype-selectbox"]').click().type('UI Testing{enter}');
    cy.get('[data-cy="testcases-related-test-ID"]').type('CCA-A-123');
    cy.get('[data-cy="add-testcase-checkbox-addanother"]').click();
    cy.get('[data-cy="add-testcase-save-btn"]').click().should('contain', 'Save');
  });
});
