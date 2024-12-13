describe('dell milestone scenarios', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    //cy.visit("http://localhost:3000/projects");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-milestone"]').click();
  });
  it('CCA-T-657( del modal of milestone )', () => {
    cy.get('[data-cy="milestone-threedots-icon0"]').click();
    cy.get('[data-cy="milestone-del-option"]').click();
  });

  it('CCA-T-658( delete the milestone )', () => {
    cy.get('[data-cy="milestone-threedots-icon0"]').click();
    cy.get('[data-cy="milestone-del-option"]').click();
  });
  it('CCA-T-1537(clarity of popup delete msg in milestone )', () => {
    cy.get('[data-cy="milestone-threedots-icon0"]').click();
    cy.get('[data-cy="milestone-del-option"]').click();
    cy.get('[data-cy="project-del--btn"]').click();
  });

  it('CCA-T-1538( closing the modal without deleting the milestone)', () => {
    cy.get('[data-cy="milestone-threedots-icon0"]').click();
    cy.get('[data-cy="milestone-del-option"]').click();
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });
});
