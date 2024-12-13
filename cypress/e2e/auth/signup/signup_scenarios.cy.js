describe('Singup  with different scenarios', () => {
  it('CCA-T-1296 (Existing Email)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('Aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('aiza.amir@sprintx.net');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1297 (Strong Password)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('Aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('aiza.amir@sprintx.net');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1298 (Password case sensitivity)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('Aiza');
    cy.get('[data-cy="signup-form-email-input"]').type('aiza.amir@sprintx.net');
    cy.get('[data-cy="signup-form-password-input"]').type('ADMIN@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('ADMIN@123');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1299 (Button behaviour with incomplete input fields)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('Aiza');
    cy.get('[data-cy="signup-form-email-input"]');
    cy.get('[data-cy="signup-form-password-input"]').type('ADMIN@123');
    cy.get('[data-cy="signup-form-confirm-password-input"]');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1300 ( Maximum Character Limit for Name)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type(
      'john doe will smith franklien watson garfield charlie 1234567890',
    );
    cy.get('[data-cy="signup-form-email-input"]').type('jivobe9513@dpsols.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });
  it('CCA-T-1301 (Invalid characters at name)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('john !@#$%^&  () 1234567890');
    cy.get('[data-cy="signup-form-email-input"]').type('vexeg94568@bustayes.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });

  it('CCA-T-1302 (email validation)', () => {
    cy.visit(`${Cypress.env('crossCheckURL')}sign-up`);
    cy.get('[data-cy="signup-form-name-input"]').type('john !@#$%^&  () 1234567890');
    cy.get('[data-cy="signup-form-email-input"]').type('vexeg94568$bustayes.com');
    cy.get('[data-cy="signup-form-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-confirm-password-input"]').type('Admin@1234');
    cy.get('[data-cy="signup-form-checkbox-input"]').click();
    cy.get('[data-cy="signup-form-termsconditions-checkbox"]').click();
    cy.get('[data-cy="signup-form-btn-input"]').click();
  });
});
