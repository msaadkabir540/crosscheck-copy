import 'cypress-real-events/support';
import '@4tw/cypress-drag-drop';

beforeEach(() => {
  //cy.login('aizaamir8@gmail.com', 'Admin@123')
  //cy.visit("http://localhost:3000/test-cases");
  cy.login(Cypress.env('loginEmail,loginPassword'));
  cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
  cy.intercept({
    url: '**/my-workspaces',
    method: 'GET',
  }).as('testcasepage');
  cy.wait('@testcasepage');
  cy.get('[data-cy="addtestcase-btn"]').click();
});

describe('Add Test Case', () => {
  it('CCA-T-73,CCA-T-75, CCA-T-78(add a test case with all mandatory data and an auto-generated Test Case ID)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat1{enter}');
    cy.get('[data-cy="add-test-case-btn-for-modal"]').click();
    cy.get('[data-cy="testcases-txteditor-testobjectivetestObjective"]').type('testing the objective');
    cy.get('[data-cy="testcases-txteditor-preconditionspreConditions"]').type('testing the preconditions');
    cy.get('[data-cy="testcases-txteditor-teststepstestSteps"]').type('testing the test steps');
    cy.get('[data-cy="testcases-txteditor-expectedresultexpectedResults"]').type('testing the expected result');
    cy.get('#points').invoke('val', '5', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="testcases-testtype-selectbox"]').click().type('UI Testing{enter}');
    cy.get('[data-cy="testcases-related-test-ID"]').click();
    cy.get('[data-cy="add-testcase-checkbox-addanother"]').click();
    cy.get('[data-cy="add-testcase-save-btn"]').click().should('contain', 'Save');
    cy.get('.Toastify').should('contain', 'Added Successfully');
  });

  it('CCA-T-80(a message is displayed when the test case table is empty)', () => {
    cy.get('[data-cy="project-input-dropdown-testcases"]').click().type('automate{enter}');
    cy.get('[data-cy="milestone-input-dropdown-testcases"]').click().type('mile1{enter}');
    cy.get('[data-cy="feature-input-dropdown-testcases"]').click().type('feat3{enter}');
    cy.get('img').should('be.visible');
  });
});
