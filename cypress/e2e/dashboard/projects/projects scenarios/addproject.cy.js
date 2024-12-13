describe('Add project', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    cy.login(Cypress.env('loginEmail,loginPassword'));
    //cy.visit("http://localhost:3000/projects");
    cy.visit(`${Cypress.env('crossCheckURL')}projects`);
    cy.get('[data-cy="allproject-addproject-btn"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
  });
  it('CCA-T-605(cannot add a project with invalid details.)', () => {
    cy.get('[data-cy="allproject-addproject-projectname"]').type('testing project');
    cy.get('#status-SelectBox').click().type('open {enter}');
    cy.get('#sharewith-SelectBox').click().type('Aiza Amir {enter}').click();
    cy.get('[data-cy="allproject-addproject-IDseries"]').type('abc');
    cy.get('[data-cy="allproject-addproject-save-btn"]').click();
  });

  it('CCA-T-606(cancel adding a new project )', () => {
    cy.get('[data-cy="allproject-addproject-projectname"]').type('testing project');
    cy.get('#status-SelectBox').click().type('open {enter}');
    cy.get('#sharewith-SelectBox').click().type('Aiza Amir {enter}').click();
    cy.get('[data-cy="addproject-model-closeicon"]').click();
  });

  it('CCA-T-607(add a project with a name that already exists)', () => {
    cy.get('[data-cy="allproject-addproject-projectname"]').type('testing project');
    cy.get('#status-SelectBox').click().type('open {enter}');
    cy.get('#sharewith-SelectBox').click().type('Aiza Amir {enter}').click();
    cy.get('[data-cy="allproject-addproject-IDseries"]').type('AZA');
    cy.get('[data-cy="allproject-addproject-save-btn"]').click();
  });
  it('CCA-T-608(with other status option)', () => {
    cy.get('[data-cy="allproject-addproject-projectname"]').type('project1');
    cy.get('#status-SelectBox').click().type('closed {enter}');
    cy.get('#sharewith-SelectBox').click().type('Aiza Amir {enter}').click();
    cy.get('[data-cy="allproject-addproject-IDseries"]').type('ABA');
    cy.get('[data-cy="allproject-addproject-save-btn"]').click();
  });
});
