describe('create run in tickets ', () => {
  beforeEach(() => {
    // cy.login(Cypress.env('loginEmail,loginPassword'))
    // cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.intercept({
    //     url: "**/my-workspaces",
    //     method: "GET"
    // }).as("testcasepage")
    // cy.wait("@testcasepage")
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  });
  it('CCA-T-1983,CCA-T-1982,CCA-T-1982,CCA-T-1980(Accessing the Bulk Edit Option as an Owner and verify that an Owner can access the "Bulk Edit" option for test cases.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="task-btn-testcases"]').click();
    cy.get('[data-cy="task-integration-clickup"]').click();
    cy.get('[data-cy="task-integration-nxt-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="HierarchicalDropdown-ticket-model"]').click();
    cy.get('[data-cy="9008240929"]').click();
    cy.get('[data-cy="90080522948"]').click();
    cy.get('[data-cy="90081287135"]').click();
    cy.get('[data-cy="900802402914"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickup-assignee-dropdown"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="tasktitle-textfield"]').type('6');
    cy.get('[data-cy="checkbox-test-run-task"]').click({ force: true });
    cy.get('[data-cy="checkbox-test-run-task"]').should('be.checked');
    cy.get('[data-cy="testrun-modal-runtitle"]').type('test run ');
    cy.get('[data-cy="testrun-modal-assignee"]').type('Aiza{enter}');
    cy.get('[data-cy="testrun-modal-description"]').click().type('it will create test run from ticket form');
    cy.get('[data-cy="testrun-modal-priority"]').type('Medium{enter}');
    cy.get('#testrun-modal-datepicker').type('02/06/2024{enter}');
    cy.get('[data-cy="create-task-button-ticket"]').click();
    cy.get('.Toastify', { timeout: 10000 }).should('contain.text', 'Task created successfully');
  });
  it('CCA-T-1981(Create Run in Create Ticket Modal - Task Creation Only and verify that creating a task without selecting the "Create Run" checkbox functions correctly.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="task-btn-testcases"]').click();
    cy.get('[data-cy="task-integration-clickup"]').click();
    cy.get('[data-cy="task-integration-nxt-btn"]').click();
    cy.get('[data-cy="HierarchicalDropdown-ticket-model"]').click();
    cy.get('[data-cy="9008240929"]').click();
    cy.get('[data-cy="90080522948"]').click();
    cy.get('[data-cy="90081287135"]').click();
    cy.get('[data-cy="900802402914"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickup-assignee-dropdown"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="tasktitle-textfield"]').type('7');
    cy.get('[data-cy="create-task-button-ticket"]').click();
    cy.get('.Toastify', { timeout: 10000 }).should('contain.text', 'Task created successfully');
    cy.get('[data-cy="project-header-tasks"]').click();
  });
  it('CCA-B-920(Create task and RUn is not able to create. Error (Project ID is a required filed) error)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
    cy.intercept({
      url: '**/my-workspaces',
      method: 'GET',
    }).as('testcasepage');
    cy.wait('@testcasepage');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="task-btn-testcases"]').click();
    cy.get('[data-cy="task-integration-clickup"]').click();
    cy.get('[data-cy="task-integration-nxt-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="HierarchicalDropdown-ticket-model"]').click();
    cy.get('[data-cy="9008240929"]').click();
    cy.get('[data-cy="90080522948"]').click();
    cy.get('[data-cy="90081287135"]').click();
    cy.get('[data-cy="900802402914"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickup-assignee-dropdown"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="tasktitle-textfield"]').type('6');
    cy.get('[data-cy="checkbox-test-run-task"]').click({ force: true });
    cy.get('[data-cy="checkbox-test-run-task"]').should('be.checked');
    cy.get('[data-cy="testrun-modal-runtitle"]').type('test run ');
    cy.get('[data-cy="testrun-modal-assignee"]').type('Aiza{enter}');
    cy.get('[data-cy="testrun-modal-description"]').click().type('it will create test run from ticket form');
    cy.get('[data-cy="testrun-modal-priority"]').type('Medium{enter}');
    cy.get('#testrun-modal-datepicker').type('02/06/2024{enter}');
    cy.get('[data-cy="create-task-button-ticket"]').click();
    cy.get('.Toastify', { timeout: 10000 }).should('contain.text', 'Task created successfully');
  });
});
