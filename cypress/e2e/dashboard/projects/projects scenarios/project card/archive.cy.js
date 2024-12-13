describe('Archive projects', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com','Admin@123')
    //cy.visit("http://localhost:3000/projects");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
  });

  it('CCA-T-609,CCA-T-610 ("Archived Projects" filter displays archived projects)', () => {
    cy.get('[data-cy="project-backdrop-threelinesicon"]').click();
    cy.get('[data-cy="project-allarchived"]').click();
  });

  it('CCA-T-611 ("highlight the selected module)', () => {
    cy.get('[data-cy="project-backdrop-threelinesicon"]').click();
    cy.get('[data-cy="project-allproject"]').click();
  });

  it('CCA-T-612 (unarchive the project)', () => {
    cy.get('[data-cy="project-backdrop-threelinesicon"]').click();
    cy.get('[data-cy="project-allarchived"]').click();
    cy.get('[data-cy="projectcard-threedots-icon"]').click();
    cy.get('[data-cy="projectcard-archive-icon"]').click();
  });
});
