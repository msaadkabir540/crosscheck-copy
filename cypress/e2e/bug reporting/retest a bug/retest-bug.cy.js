import 'cypress-file-upload';
describe('retest the bug ', { defaultCommandTimeout: 9000 }, () => {
  beforeEach(() => {
    // //  cy.login('aizaamir8@gmail.com','Admin@123')
    // // cy.visit("http://localhost:3000/qa-testing");
    // cy.login(Cypress.env('loginEmail,loginPassword'));
    // cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);

    // // cy.intercept({
    // //   url: '**/unique-tested-devices',
    // //   method: 'GET',
    // // }).as('bugreport');

    // // cy.wait('@bugreport');
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);
    cy.url().should('eq', `${Cypress.env('crossCheckURL')}qa-testing`);
    //   cy.get('[data-cy="clickonprojectmodule0"]').click()
    //  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    //   cy.get('[data-cy="project-header-bugs"]').click()
    //   cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  });

  it('CCA-T-246,CCA-T-247,CCA-T-248,CCA-T-249, CCA-T-250,', () => {
    cy.get('[data-cy="bugreporting-retest-icon5"]').wait(2000).click({ force: true });
    cy.get('[data-cy="bugreporting-retest-icon5"]').should('exist');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="bugretest-status"]').type('closed{enter}');
    cy.get('[data-cy="retestbug-modal-testedversion"]').type('cca');
    cy.get('#reTestEvidence').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('[data-cy="retest-notes"]').type('bug is resolved');
    cy.get('[data-cy="retest-save-btn"]').click();
  });
  it('CCA-T-251,CCA-T-1774(Verify that clicking the Save button without selecting a Status shows an error message.)', () => {
    cy.get('[data-cy="bugreporting-retest-icon1"]').click({ force: true });
    cy.get('[data-cy="bugretest-status"]');
    cy.get('[data-cy="retestbug-modal-testedversion"]').type('cca');
    cy.get('#reTestEvidence').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('[data-cy="retest-notes"]').type('bug is resolved');
    cy.get('[data-cy="retest-save-btn"]').click();
  });
});
