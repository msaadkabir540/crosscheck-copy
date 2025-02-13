describe('bulk edits with different roles ', () => {
  it('CCA-T-1158(Accessing the Bulk Edit Option as a QA and verify that a QA can access the "Bulk Edit" option for test cases.))', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('laiba.javaid@sprintx.net');
    cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="login-form-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-testSteps"]').type('teststeps for checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Test Case Updated');
  });
  it('CCA-T-1157(Accessing the Bulk Edit Option as a Project Manager and verify that a Project Manager can access the "Bulk Edit" option for test cases.))', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('sprintxdemo@gmail.com');
    cy.get('[data-cy="login-form-password-input"]').type('Admin1##');
    cy.get('[data-cy="login-form-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="sidebar-setting-btn-icon"]').click();
    cy.get('[data-cy="sidebar-workspace-shortcuts"]').click();
    cy.get('[data-cy="workspace-names-656090cd694925f4ec2cea4c"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-testSteps"]').type('teststeps for checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Test Case Updated');
  });
  it('CCA-T-1159(Accessing the Bulk Edit Option as a DEVELOPER and verify that a DEVELOPER can access the "Bulk Edit" option for test cases.))', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('aiza.amir@sprintx.net');
    cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="login-form-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="sidebar-setting-btn-icon"]').click();
    cy.get('[data-cy="sidebar-workspace-shortcuts"]').click();
    cy.get('[data-cy="workspace-names-656090cd694925f4ec2cea4c"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').should('not.exist');
  });
  it('CCA-T-118(Accessing the Bulk Edit Option as a QA and verify that a QA can access the "Bulk Edit" option for test cases.))', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('saad.baig@sprintx.net');
    cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="login-form-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-testSteps"]').type('teststeps for checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Test Case Updated');
  });
});
