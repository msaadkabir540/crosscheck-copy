describe('Singup  with missing input fields', () => {
  it('CCA-T-1292 (missing name)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });
  it('CCA-T-1293 (missing email)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1294 (missing password)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1295 (missing confirm password)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });
  it('CCA-T-1295 (missing terms and conditions)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('moyiri2119@frandin.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });
});
