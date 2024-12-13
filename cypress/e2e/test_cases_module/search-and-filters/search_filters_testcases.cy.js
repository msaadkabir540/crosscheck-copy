describe('search,export and filter testcases', () => {
  beforeEach(() => {
    //cy.login('aizaamir8@gmail.com', 'Admin@123')
    // cy.visit("http://localhost:3000/test-cases");
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
    cy.intercept({
      url: '**/my-workspaces',
      method: 'GET',
    }).as('testcasepage');
    cy.wait('@testcasepage');
  });
  it('search functionality', () => {
    cy.get('#searchField').click().type('AAA-T-134{enter}');
  });
  it('CCA-T-57,CCA-T-1449,CCA-T-1450(users can apply filters to the test cases table)', () => {
    cy.get('[data-cy="addtestcase-filter-btn"]').click();
    cy.get('[data-cy="testcase-filtermodal-project"]').click().type('automate{enter}');
    cy.get('[data-cy="testcase-filtermodal-miestone"]').click().type('mile1{enter}');
    cy.get('[data-cy="testcase-filtermodal-feature"]').click().type('feat2{enter}');
    cy.get('[data-cy="testcase-filtermodal-apply-btn"]').click();
  });
  it('CCA-T-58,CCA-T-1451,CCA-T-1454(Test Type filter is applied when user selects its value from dropdown)', () => {
    cy.get('[data-cy="addtestcase-filter-btn"]').click();
    cy.get('[data-cy="testcase-filtermodal-project"]').click().type('automate{enter}');
    cy.get('[data-cy="testcase-filtermodal-miestone"]').click().type('mile1{enter}');
    cy.get('[data-cy="testcase-filtermodal-feature"]').click().type('feat2{enter}');
    cy.get('[data-cy="testcase-filtermodal-createdby"]').click().type('aiza{enter}');
    cy.get('[data-cy="testcase-filtermodal-testtype"]').click().type('UI{enter}');
    cy.get('[data-cy="testcase-filtermodal-apply-btn"]').click();
  });
  it('CCA-T-59,CCA-T-1453( users can reset the applied filters to the default state)', () => {
    cy.get('[data-cy="addtestcase-filter-btn"]').click();
    cy.get('[data-cy="testcase-filtermodal-project"]').click().type('automate{enter}');
    cy.get('[data-cy="testcase-filtermodal-miestone"]').click().type('mile1{enter}');
    cy.get('[data-cy="testcase-filtermodal-feature"]').click().type('feat2{enter}');
    cy.get('[data-cy="testcase-filtermodal-createdby"]').click().type('aiza{enter}');
    cy.get('[data-cy="testcase-filtermodal-testtype"]').click().type('UI{enter}');
    cy.get('[data-cy="testcase-filtermodal-reset-btn"]').click();
  });
  it('CCA-T-86( exporting the test case)', () => {
    cy.get('[data-cy="export-testcase"]').click();
  });
});
