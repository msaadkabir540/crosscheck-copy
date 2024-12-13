describe('add feature scenarios', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com','Admin@123')
    //cy.visit("http://localhost:3000/projects");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-drag-icon0"]').click();
  });

  it('CCA-T-618, CCA-T-619, CCA-T-620,CCA-T-621 (add new feature)', () => {
    cy.get('[data-cy="add-feature-btn"]').click();
    cy.get('[data-cy="feature-name-input"]').type('feat12');
    cy.get('[data-cy="feature-name-save-btn"]').click();
  });
  it('CCA-T-622,CCA-T-623,CCA-T-624(renaming)', () => {
    cy.get('[data-cy="features-menue-threedots0"]').click();
    cy.get('[data-cy="rename-feature"]').click();
    cy.get('[data-cy="feature-name-input"]').clear().type('feat2');
    cy.get('[data-cy="feature-name-save-btn"]').click();
    cy.get('.Toastify').should('contain', 'Successfully');
  });
});
