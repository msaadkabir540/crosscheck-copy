describe('Singup on Crosscheck', () => {
  it('CCA-T-1288 (valid input)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('img').should('be.visible');
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click().should('contain', 'Sign up');
  });

  it('CCA-T-1289 (invalid email)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1290 (password Mismatch)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Dmin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1291 (Weak password)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@1');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@12');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });
});
