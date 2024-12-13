describe('Crosscheck automation', () => {
  it('CCA-T-19	( valid email and password.)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('aizaamir8@gmail.com');
    cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="login-form-btn"]').click();
  });
  it('CCA-T-20( invalid email.)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('aizaamir8gmail.com');
    cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="login-form-btn"]').click();
  });
  it('CCA-T-21(missing fields)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]');
    cy.get('[data-cy="login-form-password-input"]');
    cy.get('[data-cy="login-form-btn"]').click();
  });
  it('CCA-T-22(invalid password)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('aizaamir8@gmail.com');
    cy.get('[data-cy="login-form-password-input"]').type('admin123');
    cy.get('[data-cy="login-form-btn"]').click();
  });

  it('CCA-T-25(inactive accounts)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}`);
    cy.get('[data-cy="login-form-email-input"]').type('honapa7544@hupoi.com');
    cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="login-form-btn"]').click();
  });
});
