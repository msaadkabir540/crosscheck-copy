describe('bugs comments', { defaultCommandTimeout: 9000 }, () => {
  beforeEach(() => {
    console.log(Cypress.env());
    // cy.login('aizaamir8@gmail.com', 'Admin@123')
    cy.login(Cypress.env('loginEmail,loginPassword'));
    //cy.visit("http://localhost:3000/qa-testing");  Cypress.env('loginEmail')

    cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);
    cy.url().should('eq', `${Cypress.env('crossCheckURL')}qa-testing`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 10000 }).should('not.exist').wait(2000);
    // cy.intercept({
    //     url: "**/unique-tested-devices",
    //     method: "GET"
    // }).as("bugreport")
    // cy.wait("@bugreport")
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
  });

  it('CCA-T-1834,CCA-T-1835,CCA-T-1838(Commenting Access for All Users and verify that all users have the ability to post comments in bugs.)', () => {
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="comments-bugview-inputfield"]').type('testing the comments');
    cy.get('#attachment').attachFile('profile.jpg');
    cy.get('[data-cy="add-comment-button-viewbug-id"]').click();
  });
  it('CCA-T-1839,(Edit Comment Functionality and verify the functionality of editing a comment.))', () => {
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="edit-comentbugs1"]').click({ force: true });
    cy.get('[data-cy="bug-comments-edit-text-field"]').clear().type('testing the comments and editing');
    cy.get('[data-cy="submit-btn-bug-comment"]').click();
  });
  it.only('CCA-T-1845,(Activity Creation for Bug Comment and verify the creation of an activity when a user posts a comment on a bug.))', () => {
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="comments-dropdown-icon"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="comments-dropdown-options1"]').click();
    cy.get('.tab-content').contains('testing the comments');
  });
  it('CCA-T-1840,(Discard Changes in Edit Comment and verify that changes made during the edit comment process can be discarded.)', () => {
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="edit-comentbugs1"]').click({ force: true });
    cy.get('[data-cy="discard-btn-bug-comment"]').click();
  });

  it('CCA-T-1841,(Delete Comment Confirmation Modal and verify the appearance and functionality of the delete comment confirmation modal.)', () => {
    //cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="del-comentbugs0"]').click({ force: true });
    cy.get('[data-cy="project-del--btn"]').click();
  });

  it('CCA-T-1842,(Cancel Delete Comment and verify that a comment is not deleted if the user cancels the delete action.)', () => {
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('[data-cy="del-comentbugs0"]').click({ force: true });
    cy.get('[data-cy="project-nokeepit--btn"]').click();
  });

  it('CCA-T-1843 (should display comments in the correct order for a specific bug)', () => {
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')
    cy.get('[data-cy="bud-testid-column0"]').click();
    cy.get('[data-cy="bug-view-comments2"]').click();
    cy.get('#comments-container').should('exist');
    cy.get('#comments-container').then((comments) => {
      console.log({ comments });
      expect(comments.length).to.be.gte(1);
      for (let i = 0; i < comments.length - 1; i++) {
        const currentCommentTime = new Date(comments[i].getAttribute('data-comment-time'));
        const nextCommentTime = new Date(comments[i + 1].getAttribute('data-comment-time'));
        expect(currentCommentTime.getTime()).to.be.lte(nextCommentTime.getTime());
      }
    });
  });
});
