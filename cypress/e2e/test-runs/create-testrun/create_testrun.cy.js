describe('create test run', () => {
  beforeEach(() => {
    // cy.login('aizaamir8@gmail.com', 'Admin@123')
    //cy.visit("http://localhost:3000/test-run");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-run`);
  });
  it('CCA-T-154,CCA-T-155,CCA-T-161 (user can enter valid data in the "Add Test Run" form and save the new Test Run.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('testcases');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 3000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox0"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 4000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
    cy.get('[data-cy="testrun-modal-description"]').type('helloworld');
    cy.get('#testrun-modal-datepicker').click().type('12/02/2023{enter}');
    cy.get('[data-cy="testrun-modal-priority"]').type('High{enter}');
    cy.get('[data-cy="testrun-modal-assignee"]').type('aiza{enter}');
    cy.get('[data-cy="testrun-modal-save-btn"]').click();
  });
  it('CCA-T-156(the user can select test cases from different milestones and features.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox1"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
    cy.get('[data-cy="testrun-modal-description"]').type('helloworld1');
    cy.get('#testrun-modal-datepicker').click().type('12/02/2023{enter}');
    cy.get('[data-cy="testrun-modal-priority"]').type('High{enter}');
    cy.get('[data-cy="testrun-modal-assignee"]').type('aiza{enter}');
    cy.get('[data-cy="testrun-modal-save-btn"]').click();
  });
  it('CCA-T-157(Verify that changing the selected project in the "Add Test Run" form discards previously selected test cases.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox1"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
    cy.get('[data-cy="testrun-modal-description"]').type('helloworld1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('testing{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox0"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
  });
  it('CCA-T-158( user can click on the "View All Selected" text to display all selected test cases in the "Select Test Cases" modal.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox0"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="viewalltestcases-testrun-btn"]').click();
  });
  it('CCA-T-159( user can search for specific test cases using the search bar in the "Select Test Cases" modal.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-searchbar"]').type('AAA-T-13');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
  });

  it('CCA-T-160(user can discard the selection of test cases in the "Select Test Cases" modal using the "Discard" button)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox1"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-discard-btn"]').click();
    cy.get('[data-cy="bugreporting-discardchanging-btn"]').click();
  });
  it('CCA-T-162 (Verify that the user can discard entered data in the "Add Test Run" form)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('testcases');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox0"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
    cy.get('[data-cy="testrun-modal-description"]').type('helloworld');
    cy.get('#testrun-modal-datepicker').click().type('12/02/2023{enter}');
    cy.get('[data-cy="testrun-modal-priority"]').type('High{enter}');
    cy.get('[data-cy="testrun-modal-assignee"]').type('aiza{enter}');
    cy.get('[data-cy="testrun-modal-discard-btn"]').click();
    cy.get('[data-cy="bugreporting-discardchanging-btn"]').click();
  });

  it('CCA-T-163(the user can add a new Test Run with optional fields left empty.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox1"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
    cy.get('#testrun-modal-datepicker').click().type('12/02/2023{enter}');
    cy.get('[data-cy="testrun-modal-priority"]').type('High{enter}');
    cy.get('[data-cy="testrun-modal-assignee"]').type('aiza{enter}');
    cy.get('[data-cy="testrun-modal-save-btn"]').click();
  });
  it.only('CCA-T-164(after selecting the test cases click again on view all selected.)', () => {
    cy.get('[data-cy="testrun-addtestrun-btn"]').click();
    cy.get('[data-cy="testrun-modal-runtitle"]').type('automated testrun testcases1');
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="testrun-testcasemodal-project"]').type('automate{enter}');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-milestone-checkbox1"]').click({ force: true });
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
    cy.get('[data-cy="testrun-modal-testcase"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist');
    cy.get('[data-cy="viewalltestcases-testrun-btn"]').click();
    cy.get('[data-cy="testrun-testcasemodal-save-btn"]').click();
  });
});
