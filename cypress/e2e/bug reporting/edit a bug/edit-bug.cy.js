describe('edit bug and scenarios', { defaultCommandTimeout: 9000 }, () => {
  beforeEach(() => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);
    // cy.get('[data-cy="clickonprojectmodule0"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="project-header-bugs"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  });
  it('edit the bug', () => {
    cy.get('[data-cy="bugreporting-edit1-icon1"]').click({ force: true });
    cy.get('[data-cy="bugreporting-editfoem-featuredropdown"]').type('feat1{enter}');
    cy.get('[data-cy="bugreport-edit-bugtype"]').type('functionality{enter}');
    cy.get('[data-cy="bugreport-edit-severity"]').type('critical');
    cy.get('[data-cy="bugreport-edit-save-btn"]');
  });
  it.only('discard button', () => {
    cy.get('[data-cy="bugreporting-edit1-icon1"]').click({ force: true });
    cy.get('[data-cy="bugreporting-editfoem-featuredropdown"]').type('feat1{enter}');
    cy.get('[data-cy="bugreport-edit-feedbackfeedback"]').type('edit the feedback');
    cy.get('[data-cy="bugreport-edit-idealbehaviouridealBehaviour"]').type('edit the ideal behaviour');
    cy.get('[data-cy="bugreport-edit-bugtype"]').type('functionality{enter}');
    cy.get('[data-cy="bugreport-edit-severity"]').type('critical{enter}');
    cy.get('[data-cy="bugreport-edit-dicard-btn"]').click();
    cy.get('[data-cy="bugreporting-discardchanging-btn"]').click();
  });
  it('clicking on back to form', () => {
    cy.get('[data-cy="bugreporting-edit1-icon1"]').click({ force: true });
    cy.get('[data-cy="bugreporting-editfoem-featuredropdown"]').type('feat1{enter}');
    cy.get('[data-cy="bugreport-edit-feedbackfeedback"]').type('edit the feedback');
    cy.get('[data-cy="bugreport-edit-idealbehaviouridealBehaviour"]').type('edit the ideal behaviour');
    cy.get('[data-cy="bugreport-edit-bugtype"]').type('functionality{enter}');
    cy.get('[data-cy="bugreport-edit-severity"]').type('critical{enter}');
    cy.get('[data-cy="bugreport-edit-dicard-btn"]').click();
    cy.get('[data-cy="bugreporting-backtoform-btn"]').click();
  });
});
