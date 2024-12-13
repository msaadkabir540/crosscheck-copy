describe('delete feature and other scenarios', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    //cy.visit("http://localhost:3000/projects");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="clickonprojectmodule0"]').click();
  });
  it('CCA-T-625,CCA-T-626,(clicking on three dots del model will open)', () => {
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-drag-icon0"]').click();
    cy.get('[data-cy="features-menue-threedots3"]').click();
    cy.get('[data-cy="delete-feature"]').click();
    cy.get('[data-cy="project-del--btn"]').click();
  });

  it('CCA-T-627(add the feature without giving name while creating)', () => {
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-drag-icon0"]').click();
    cy.get('[data-cy="add-feature-btn"]').click();
    cy.get('[data-cy="feature-name-input"]');
    cy.get('[data-cy="feature-name-save-btn"]').click();
  });
  it('CCA-T-628(add the feature without giving name while editing)', () => {
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-drag-icon0"]').click();
    cy.get('[data-cy="features-menue-threedots3"]').click();
    cy.get('[data-cy="rename-feature"]').click();
    cy.get('[data-cy="feature-name-input"]').clear();
    cy.get('[data-cy="feature-name-save-btn"]').click();
  });

  it('CCA-T-1539(successfully deleted popup msg will display )', () => {
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-drag-icon0"]').click();
    cy.get('[data-cy="features-menue-threedots3"]').click();
    cy.get('[data-cy="delete-feature"]').click();
    cy.get('[data-cy="project-del--btn"]').click();
    cy.get('.Toastify').should('contain', 'Feature Deleted Successfully');
  });

  it('CCA-T-1540(close the modal without deleting it)', () => {
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-drag-icon0"]').click();
    cy.get('[data-cy="features-menue-threedots3"]').click();
    cy.get('[data-cy="delete-feature"]').click();
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });
});
