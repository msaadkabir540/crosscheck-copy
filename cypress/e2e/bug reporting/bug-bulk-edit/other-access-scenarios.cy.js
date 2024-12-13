describe('bulk edits with different roles ', () => {
  it('CCA-T-1134, CCA-T-1139(Accessing the Bulk Edit Option as an Admin and verify that an Admin can access the "Bulk Edit" option for test cases.)', () => {
    // cy.visit(`${Cypress.env('crossCheckURL')}`);
    // cy.get('[data-cy="login-form-email-input"]').type('saad.baig@sprintx.net');
    // cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    // cy.get('[data-cy="login-form-btn"]').click();
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="sidebar-setting-btn-icon"]').click()
    // cy.get('[data-cy="sidebar-workspace-shortcuts"]').click()
    // cy.get('[data-cy="workspace-names-656090cd694925f4ec2cea4c"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    //cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-severity"]').type('Medium{enter}');
    cy.get('[data-cy="bug-bulkedit-bugtype"]').type('Performance{enter}');
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile1{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-bug-subtype"]').type('responsiveness{enter}');
    cy.get('[data-cy="bug-bulkedit-testing-type"]').type('Regression Testing{enter}');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').type('CCA-111');
    cy.get('[data-cy="bug-bulkedit-tested-version"]').type('MOBILE');
    cy.get('[data-cy="bug-bulkedit-developerID"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Bugs Updated Successfully');
  });
  it('CCA-T-1135(Accessing the Bulk Edit Option as a Project manager and verify that a PM user can access the "Bulk Edit" option.)', () => {
    // cy.visit(`${Cypress.env('crossCheckURL')}`);
    // cy.get('[data-cy="login-form-email-input"]').type('sprintxdemo@gmail.com');
    // cy.get('[data-cy="login-form-password-input"]').type('Admin1##');
    // cy.get('[data-cy="login-form-btn"]').click();
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="sidebar-setting-btn-icon"]').click()
    // cy.get('[data-cy="sidebar-workspace-shortcuts"]').click()
    // cy.get('[data-cy="workspace-names-656090cd694925f4ec2cea4c"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.login(Cypress.env('saifEmail,saifPassword'))
    cy.login(Cypress.env('saifEmail'), Cypress.env('saifPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-severity"]').type('Medium{enter}');
    cy.get('[data-cy="bug-bulkedit-bugtype"]').type('Performance{enter}');
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile1{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-bug-subtype"]').type('responsiveness{enter}');
    cy.get('[data-cy="bug-bulkedit-testing-type"]').type('Regression Testing{enter}');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').type('CCA-111');
    cy.get('[data-cy="bug-bulkedit-tested-version"]').type('MOBILE');
    cy.get('[data-cy="bug-bulkedit-developerID"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Bugs Updated Successfully');
  });
  it('CCA-T-1136(Accessing the Bulk Edit Option as a QA and verify that a QA user can access the "Bulk Edit" option.)', () => {
    // cy.visit(`${Cypress.env('crossCheckURL')}`);
    // cy.get('[data-cy="login-form-email-input"]').type('laiba.javaid@sprintx.net');
    // cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    // cy.get('[data-cy="login-form-btn"]').click();
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.login(Cypress.env('laibaEmail,laibaPassword'))
    // cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.login(Cypress.env('laibaEmail'), Cypress.env('laibaPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    //cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-severity"]').type('Medium{enter}');
    cy.get('[data-cy="bug-bulkedit-bugtype"]').type('Performance{enter}');
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile1{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-bug-subtype"]').type('responsiveness{enter}');
    cy.get('[data-cy="bug-bulkedit-testing-type"]').type('Regression Testing{enter}');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').type('CCA-111');
    cy.get('[data-cy="bug-bulkedit-tested-version"]').type('MOBILE');
    cy.get('[data-cy="bug-bulkedit-developerID"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Bugs Updated Successfully');
  });
  it('CCA-T-1137 ,CCA-T-1151 (Inaccessibility of Bulk Edit Option for a Developer and verify that a Developer does not have access to the "Bulk Edit" option.)', () => {
    // cy.visit(`${Cypress.env('crossCheckURL')}`);
    // cy.get('[data-cy="login-form-email-input"]').type('aiza.amir@sprintx.net');
    // cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    // cy.get('[data-cy="login-form-btn"]').click();
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.login(Cypress.env('devEmail,devPassword'))
    cy.login(Cypress.env('devEmail'), Cypress.env('devPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').should('not.exist');
  });
  it('CCA-T-1150(Bulk Edit with Large Amount of Data and verify that the bulk edit functionality can handle a large amount of data without performance issues.)', () => {
    // cy.visit(`${Cypress.env('crossCheckURL')}`);
    // cy.get('[data-cy="login-form-email-input"]').type('aiza.amir@sprintx.net');
    // cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    // cy.get('[data-cy="login-form-btn"]').click();
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="sidebar-setting-btn-icon"]').click()
    // cy.get('[data-cy="sidebar-workspace-shortcuts"]').click()
    // cy.get('[data-cy="workspace-names-6524ed61cf185c1fef80262e"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    cy.login(Cypress.env('loginEmail'), Cypress.env('loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="project-header-bugs"]').click().wait(2000);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="overallcheckbox"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-severity"]').type('Medium{enter}');
    cy.get('[data-cy="bug-bulkedit-bugtype"]').type('Performance{enter}');
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile1{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-bug-subtype"]').type('responsiveness{enter}');
    cy.get('[data-cy="bug-bulkedit-testing-type"]').type('Regression Testing{enter}');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').type('CCA-111');
    cy.get('[data-cy="bug-bulkedit-tested-version"]').type('MOBILE');
    cy.get('[data-cy="bug-bulkedit-developerID"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Bugs Updated Successfully');
  });
});
