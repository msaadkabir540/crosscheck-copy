describe('bug bulk edit', { defaultCommandTimeout: 8000 }, () => {
  console.log(Cypress.env());

  beforeEach(() => {
    // // cy.login('aizaamir8@gmail.com','Admin@123')
    // cy.login(Cypress.env('loginEmail,loginPassword'))
    // cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);
    // // cy.visit("http://localhost:3000/qa-testing");
    // // cy.get('[data-cy="crosscheck-loader"]',{ timeout: 5000 }).should('not.exist')
    // cy.intercept({
    //     url: "**/unique-tested-devices",
    //     method: "GET"
    // }).as("bugreport")
    // cy.wait("@bugreport")
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 6000 }).should('not.exist')
    // cy.login(Cypress.env('loginEmail,loginPassword'))
    // cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="clickonprojectmodule0"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="project-header-bugs"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  });
  it('CCA-T-1133,CCA-T-1138,CCA-T-1141,CCA-T-1144,CCA-T-1149, CCA-T-1152(Accessing the Bulk Edit Option as an Owner and To verify that an Owner can access the "Bulk Edit" option.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
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
  it('CCA-T-1140,(Bulk Edit" Modal Options and verify that the "Bulk Edit" modal contains the expected options.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('._modalContentWrapper_ih9j8_19').contains('Milestone');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Feature');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Severity');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Bug Type');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Bug Subtype');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Testing Type');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Task ID');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Tested Version');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Developer');
  });
  it('CCA-T-1142,(Disable "Update All" Button and verify that the "Update All" button is disabled when no bug fields are selected for update.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bulkedit-submit-btn"]').should('be.disabled');
  });
  it('CCA-T-1143,(Feature and Milestone Dependency and verify the dependency between selecting a feature and a milestone for updating.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-severity"]').type('Medium{enter}');
    cy.get('[data-cy="bug-bulkedit-bugtype"]').type('Performance{enter}');
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile1{enter}');
    cy.get('[data-cy="bug-bulkedit-testing-type"]').type('Regression Testing{enter}');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').type('CCA-111');
    cy.get('[data-cy="bug-bulkedit-tested-version"]').type('MOBILE');
    cy.get('[data-cy="bug-bulkedit-developerID"]').type('Aiza Amir{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', 'Feature is required');
  });

  it('CCA-T-1145,CCA-T-1154( Bulk Edit without Selecting Bugs and verify that you cannot initiate bulk edit without selecting any bugs.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').should('not.exist');
  });

  it('CCA-T-1147(Bulk Editing with All Optional Fields Empty and verify that you can bulk edit bugs with all optional fields left empty.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile1{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Bugs Updated Successfully');
  });
  it('CCA-T-1148(Updating Feature and Milestone Together and verify that you can update both feature and milestone together.)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox0"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat2{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Bugs Updated Successfully');
  });
  it.only('CCA-T-1153,CCA-T-1146(Bulk Editing Bugs of a Single Project Only and verify that you can only bulk edit bugs of one project at a time)', () => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`).wait(2000);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-bugs"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bug-table-checkbox1"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox2"]').click({ force: true });
    cy.get('[data-cy="bug-table-checkbox3"]').click({ force: true });
    cy.get('[data-cy="bug-bulk-edit-btn"]').should('exist');
  });
});
