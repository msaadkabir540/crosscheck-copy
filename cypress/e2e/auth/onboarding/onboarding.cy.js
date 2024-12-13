import 'cypress-file-upload';

describe('onboarding on Crosscheck', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com','Admin@123')
    // cy.visit("http://localhost:3000/on-boarding/aizaamir8@gmail.com");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}on-boarding/aizaamir8@gmail.com`);
  });
  it('CCA-T-1326  (naming the workspace)', () => {
    cy.get('[data-cy="onbaording-naming of workspace"]').type('testing workspace');
    cy.get('[data-cy="onbaording-naming-workspace-btn"]').click();
  });

  it('CCA-T-1327 (workspace avatar)', () => {
    cy.get('[data-cy="onbaording-naming of workspace"]').type('testing workspace');
    cy.get('[data-cy="onbaording-naming-workspace-btn"]').click();
    cy.get('#file').attachFile('profile.jpg');
    cy.get('[data-cy="onboard-workspace-avatar-nxtbtn"]').click();
  });

  it('CCA-T-1328 (how many people)', () => {
    cy.get('[data-cy="onbaording-naming of workspace"]').type('testing workspace');
    cy.get('[data-cy="onbaording-naming-workspace-btn"]').click();
    cy.get('#file').attachFile('profile.jpg');
    cy.get('[data-cy="onboard-workspace-avatar-nxtbtn"]').click();
    cy.get('[data-cy="onboard-workspace-avatar-ranges2"]').click();
    cy.get('[data-cy="onboard-workspace-peopleworking-nxtbtn"]').click();
  });

  it('CCA-T-1329 (hear about us)', () => {
    cy.get('[data-cy="onbaording-naming of workspace"]').type('testing workspace');
    cy.get('[data-cy="onbaording-naming-workspace-btn"]').click();
    cy.get('#file').attachFile('profile.jpg');
    cy.get('[data-cy="onboard-workspace-avatar-nxtbtn"]').click();
    cy.get('[data-cy="onboard-workspace-avatar-ranges2"]').click();
    cy.get('[data-cy="onboard-workspace-peopleworking-nxtbtn"]').click();
    cy.get('[data-cy="onboard-workspace-hear-about-us3"]').click();
    cy.get('[data-cy="onboard-workspace-hear-about-us-nxt-btn"]').click();
  });
});
