describe('onboarding on Crosscheck', () => {
  it('CCA-T-1330 (Selecting a Plan (Free Plan) and verify that users can select the Free Plan for their workspace.)', () => {
    //cy.login('aizaamir8@gmail.com', 'Admin@123')
    // cy.visit("http://localhost:3000/on-boarding/aizaamir8@gmail.com");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}on-boarding/aizaamir8@gmail.com`);
    cy.get('[data-cy="onbaording-naming of workspace"]').type('testing workspace');
    cy.get('[data-cy="onbaording-naming-workspace-btn"]').click();
    cy.get('#file').attachFile('profile.jpg');
    cy.get('[data-cy="onboard-workspace-avatar-nxtbtn"]').click();
    cy.get('[data-cy="onboard-workspace-avatar-ranges2"]').click();
    cy.get('[data-cy="onboard-workspace-peopleworking-nxtbtn"]').click();
    cy.get('[data-cy="onboard-workspace-hear-about-us3"]').click();
    cy.get('[data-cy="onboard-workspace-hear-about-us-nxt-btn"]').click();
    cy.get('[data-cy="plan-card-onboard0"]').click();
    cy.get('[data-cy="onboard-plan-submit-btn"]').click();
  });
});
