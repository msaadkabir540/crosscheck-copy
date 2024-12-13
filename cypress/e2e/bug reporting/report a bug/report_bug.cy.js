import 'cypress-file-upload';
describe('bug reporting feature', { defaultCommandTimeout: 8000 }, () => {
  beforeEach(() => {
    // // cy.login('aizaamir8@gmail.com','Admin@123')
    // // cy.visit("http://localhost:3000/qa-testing");
    // cy.login(Cypress.env('loginEmail,loginPassword'));
    // cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);     cy.url().should('eq', `${Cypress.env('crossCheckURL')}qa-testing`);
    // cy.intercept({
    //   url: '**/unique-tested-devices',
    //   method: 'GET',
    // }).as('bugreport');
    // cy.wait('@bugreport');
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}qa-testing`);
    cy.url().should('eq', `${Cypress.env('crossCheckURL')}qa-testing`);
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    //  cy.intercept({
    //   url: '**/unique-tested-devices',
    //   method: 'GET',
    // }).as('bugreport');
    // cy.wait('@bugreport');
    // cy.get('[data-cy="clickonprojectmodule0"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // cy.get('[data-cy="project-header-bugs"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  });

  it('CCA-T-232,CCA-T-233,CCA-T-321,CCA-T-322,CCA-T-323,CCA-T-324 report a bug', () => {
    cy.get('[data-cy="bug-reporting-starttesting-btn"]').wait(2000).click();
    cy.get('#reportbug-project-dropdown').type('automate{enter}');
    cy.get('#reportbug-milestone-dropdown').type('mile1{enter}');
    cy.get('#reportbug-feature-dropdown').type('feat1{enter}');
    cy.get('[data-cy="reportbug-texteditorfeedback"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-texteditorreproduceSteps"]').type('steps for bug report');
    cy.get('[data-cy="reportbug-texteditoridealBehaviour"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-severity-dropdown"]').type('medium{enter}');
    cy.get('[data-cy="reportbug-bugtype-dropdown"]').type('UI{enter}');
    cy.get('[data-cy="reportbug-developername-dropdown"]').type('aiza amir{enter}');
    cy.get('[data-cy="reportbug-taskid"]').type('CCA-1{enter}');
    cy.get('[data-cy="reportbug-testedversion-dropdown"]').type('CCA-1{enter}');
    cy.get('[data-cy="reportbug-testingtype-dropdown"]').type('functional{enter}');
    cy.get('#testEvidence').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('#reportbug-save-btn').click();
  });

  it('CCA-T-325,(Verify that the user cannot report a bug without filling in all required fields.)', () => {
    cy.get('[data-cy="bug-reporting-starttesting-btn"]').wait(2000).click();
    cy.get('#reportbug-project-dropdown').type('automate{enter}');
    cy.get('#reportbug-milestone-dropdown').type('mile1{enter}');
    cy.get('#reportbug-feature-dropdown').type('feat1{enter}');
    cy.get('[data-cy="reportbug-texteditorfeedback"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-texteditorreproduceSteps"]').type('steps for bug report');
    cy.get('[data-cy="reportbug-texteditoridealBehaviour"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-severity-dropdown"]').type('medium{enter}');
    cy.get('[data-cy="reportbug-bugtype-dropdown"]').type('UI{enter}');
    cy.get('[data-cy="reportbug-developername-dropdown"]').type('aiza amir{enter}');
    cy.get('[data-cy="reportbug-taskid"]').type('CCA-1{enter}');
    cy.get('[data-cy="reportbug-testingtype-dropdown"]');
    cy.get('#testEvidence').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('#reportbug-save-btn').click();
  });

  it('CCA-T-326,(Verify that the user cannot report a bug without attaching Test Evidence.)', () => {
    cy.get('[data-cy="bug-reporting-starttesting-btn"]').wait(2000).click();
    cy.get('#reportbug-project-dropdown').type('automate{enter}');
    cy.get('#reportbug-milestone-dropdown').type('mile1{enter}');
    cy.get('#reportbug-feature-dropdown').type('feat1{enter}');
    cy.get('[data-cy="reportbug-texteditorfeedback"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-texteditorreproduceSteps"]').type('steps for bug report');
    cy.get('[data-cy="reportbug-texteditoridealBehaviour"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-severity-dropdown"]').type('medium{enter}');
    cy.get('[data-cy="reportbug-bugtype-dropdown"]').type('UI{enter}');
    cy.get('[data-cy="reportbug-developername-dropdown"]').type('aiza amir{enter}');
    cy.get('[data-cy="reportbug-taskid"]').type('CCA-1{enter}');
    cy.get('[data-cy="reportbug-testingtype-dropdown"]');
    cy.get('#testEvidence').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click;
    cy.get('#reportbug-save-btn').click();
  });

  it('CCA-T-327,(Verify that the user can successfully close the "Report Bug" form using the cross icon.)', () => {
    cy.get('[data-cy="bug-reporting-starttesting-btn"]').wait(2000).click();
    cy.get('#reportbug-project-dropdown').type('automate{enter}');
    cy.get('#reportbug-milestone-dropdown').type('mile1{enter}');
    cy.get('#reportbug-feature-dropdown').type('feat1{enter}');
    cy.get('[data-cy="close-bugreporting-modal"]').click();
  });

  it('CCA-T-328,  Verify that the user cannot report a bug with invalid Test Evidence (e.g., unsupported file format).', () => {
    cy.get('[data-cy="bug-reporting-starttesting-btn"]').wait(2000).click();
    cy.get('#reportbug-project-dropdown').type('automate{enter}');
    cy.get('#reportbug-milestone-dropdown').type('mile1{enter}');
    cy.get('#reportbug-feature-dropdown').type('feat1{enter}');
    cy.get('[data-cy="reportbug-texteditorfeedback"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-texteditorreproduceSteps"]').type('steps for bug report');
    cy.get('[data-cy="reportbug-texteditoridealBehaviour"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-severity-dropdown"]').type('medium{enter}');
    cy.get('[data-cy="reportbug-bugtype-dropdown"]').type('UI{enter}');
    cy.get('[data-cy="reportbug-developername-dropdown"]').type('aiza amir{enter}');
    cy.get('[data-cy="reportbug-taskid"]').type('CCA-1{enter}');
    cy.get('[data-cy="reportbug-testingtype-dropdown"]').type('functional{enter}');
    cy.get('#testEvidence').attachFile('Stay in the know with our detailed activity log.pdf');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('#reportbug-save-btn').click();
  });
  it(' CCA-T-329, Verify that Ticket ID, Bug Sub Type and Tested Version are not mandatory fields', () => {
    cy.get('[data-cy="bug-reporting-starttesting-btn"]').wait(2000).click();
    cy.get('#reportbug-project-dropdown').type('automate{enter}');
    cy.get('#reportbug-milestone-dropdown').type('mile1{enter}');
    cy.get('#reportbug-feature-dropdown').type('feat1{enter}');
    cy.get('[data-cy="reportbug-texteditorfeedback"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-texteditorreproduceSteps"]').type('steps for bug report');
    cy.get('[data-cy="reportbug-texteditoridealBehaviour"]').type('feedback for bug report');
    cy.get('[data-cy="reportbug-severity-dropdown"]').type('medium{enter}');
    cy.get('[data-cy="reportbug-bugtype-dropdown"]').type('UI{enter}');
    cy.get('[data-cy="reportbug-developername-dropdown"]').type('aiza amir{enter}');
    cy.get('[data-cy="reportbug-testingtype-dropdown"]').type('functional{enter}');
    cy.get('#testEvidence').attachFile('profile.jpg');
    cy.get('[data-cy="uploadfile-bugreport"]').click();
    cy.get('#reportbug-save-btn').click();
  });
});
