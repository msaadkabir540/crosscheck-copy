describe('project card edit', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    //cy.visit("http://localhost:3000/projects");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="projectcard-threedots-icon2"]').click();
  });

  it('CCA-T-614 ( edit the info project card )', () => {
    cy.get('[data-cy="projectcard-edit-icon"]').click();
    cy.get('[data-cy="allproject-addproject-projectname"]').clear().type('automate');
    cy.get('[data-cy="allproject-addproject-save-btn"]').click();
  });
  it('CCA-T-615( with invalid info )', () => {
    cy.get('[data-cy="projectcard-edit-icon"]').click();
    cy.get('[data-cy="allproject-addproject-projectname"]').clear().type('automate');
    cy.get('[data-cy="allproject-addproject-IDseries"]').clear().type('abc');
    cy.get('[data-cy="allproject-addproject-save-btn"]').click();
  });
  it('CCA-T-616(close the model)', () => {
    cy.get('[data-cy="projectcard-edit-icon"]').click();
    cy.get('[data-cy="addproject-model-closeicon"]').click();
  });
  it('CCA-T-617(project name already exist)', () => {
    cy.get('[data-cy="projectcard-edit-icon"]').click();
    cy.get('[data-cy="allproject-addproject-projectname"]').clear().type('automation 2');
    cy.get('[data-cy="allproject-addproject-save-btn"]').click();
  });

  it('CCA-T-618(del project popup msg)', () => {
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="projectcard-del-icon"]').click();
  });

  it('CCA-T-619(no keep it btn)', () => {
    cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click();
    cy.get('[data-cy="projectcard-del-icon"]').click();
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });
});
