import '@4tw/cypress-drag-drop';
import 'cypress-real-events/support';
describe('add milestone scenarios', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    // cy.visit("http://localhost:3000/projects");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
  });

  it('CCA-T-649 ( display count of milestone )', () => {
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="project-add-milestone"]').click();
  });
  it('CCA-T-651 (add milestone model display)', () => {
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="project-add-milestone"]').click();
  });

  it('CCA-T-652 (add milestone)', () => {
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="project-add-milestone"]').click();
    cy.get('[data-cy="add-milestone-input"]').type('milestone testing');
    cy.get('[data-cy="add-milestone-save-btn"]').click();
  });

  it('CCA-T-653 (opens rename module)', () => {
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-threedots-icon0"]').click();
    cy.get('[data-cy="milestone-rename-option"]').click();
  });

  it('CCA-T-654 (rename the milestone)', () => {
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="milestone-threedots-icon0"]').click();
    cy.get('[data-cy="milestone-rename-option"]').click();
    cy.get('[data-cy="add-milestone-input"]').clear().type('renaming');
    cy.get('[data-cy="add-milestone-save-btn"]').click();
  });

  it('CCA-T-655,CCA-T-656 (add milestone without name)', () => {
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
    cy.get('[data-cy="project-add-milestone"]').click();
    cy.get('[data-cy="add-milestone-save-btn"]').click();
  });
});
