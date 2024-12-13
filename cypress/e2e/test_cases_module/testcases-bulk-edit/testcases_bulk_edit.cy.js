describe('bulk edit of testcases', () => {
  beforeEach(() => {
    cy.login(Cypress.env('loginEmail,loginPassword'));
    cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.intercept({
      url: '**/my-workspaces',
      method: 'GET',
    }).as('testcasepage');
    cy.wait('@testcasepage');
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
  });
  it('CCA-T-1155,CCA-T-1156, CCA-T-1160,CCA-T-1166,CCA-T-1173(Accessing the Bulk Edit Option as an Owner and verify that an Owner can access the "Bulk Edit" option for test cases.)', () => {
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('#points').invoke('val', '8', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    // cy.get('[data-cy="testcases-related-test-ID"]').click()
    cy.get('[data-cy="bulkedit-preConditions"]').type(
      ' setup for testcasesnew setup for testcases new setup for testcases new setup for testcases new setup for testcases',
    );
    cy.get('[data-cy="bulkedit-testSteps"]').type(' checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Test Case Updated');
  });
  it('CCA-T-1162(Bulk Edit" Modal Options for Test Cases and verify that the "Bulk Edit" modal for test cases contains the expected options.)', () => {
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('._modalContentWrapper_ih9j8_19').contains('Milestone');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Feature');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Test Type');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Weightage');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Related Ticket ID');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Pre Conditions');
    cy.get('._modalContentWrapper_ih9j8_19').contains('Test Steps');
    cy.get('._modalContentWrapper_ih9j8_19').contains('State');
  });
  it('CCA-T-1163(Updating Test Cases with "Bulk Edit" and verify that you can update the values of selected test cases using the "Bulk Edit" functionality.)', () => {
    cy.get('[data-cy="checkbox-testcase-column8"]').click();
    cy.get('[data-cy="checkbox-testcase-column9"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-preConditions"]').type(
      'testcases new setup for testcases new setup for testcases new setup for testcases new setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcases new setup for testcases new setup for testcases new setup for testcases',
    );
    cy.get('[data-cy="bulkedit-testSteps"]').type('checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', ' Successfully');
  });
  it('CCA-T-1164( Disable "Update all" Button for Test Cases and verify that the "Update all" button is disabled (Not Visible) when no test cases fields are filled for update.)', () => {
    cy.get('[data-cy="checkbox-testcase-column8"]').click();
    cy.get('[data-cy="checkbox-testcase-column9"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bulkedit-submit-btn"]').click({ force: true });
    cy.get('[data-cy="bulkedit-submit-btn"]').should('be.disabled');
  });
  it('CCA-T-1165(Feature and Milestone Dependency for Test Cases and verify the dependency between selecting a feature and a milestone for updating test cases.)', () => {
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('#points').invoke('val', '8', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-preConditions"]').type('for testcases');
    cy.get('[data-cy="bulkedit-testSteps"]').type('teststeps for checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', 'Feature is required');
  });
  it('CCA-T-1167( Bulk Edit without Selecting Test Cases and verify that you cannot initiate bulk edit without selecting any test cases.)', () => {
    cy.get('[data-cy="checkbox-testcase-column0"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').should('not.exist');
  });

  it('CCA-T-1168(Bulk Editing Test Cases of a Single Project Only and verify that you can only bulk edit test cases of one project at a time.)', () => {
    cy.get('[data-cy="checkbox-testcase-column0"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').should('not.exist');
  });

  it('CCA-T-1170,CCA-T-1171(Bulk Editing with All Optional Fields Empty and verify that you can bulk edit test cases with all optional fields left empty.)', () => {
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Test Case Updated');
  });
  it('CCA-T-1174(Bulk Edit with Maximum Allowed Test Cases and verify that the bulk edit functionality can handle the maximum allowed number of test cases.)', () => {
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="checkbox-testcase-column6"]').click();
    cy.get('[data-cy="checkbox-testcase-column7"]').click();
    cy.get('[data-cy="checkbox-testcase-column8"]').click();
    cy.get('[data-cy="checkbox-testcase-column9"]').click();
    cy.get('[data-cy="checkbox-testcase-column11"]').click();
    cy.get('[data-cy="checkbox-testcase-column12"]').click();
    cy.get('[data-cy="checkbox-testcase-column13"]').click();
    cy.get('[data-cy="checkbox-testcase-column14"]').click();
    cy.get('[data-cy="checkbox-testcase-column15"]').click();
    cy.get('[data-cy="checkbox-testcase-column16"]').click();
    cy.get('[data-cy="checkbox-testcase-column17"]').click();
    cy.get('[data-cy="checkbox-testcase-column18"]').click();
    cy.get('[data-cy="checkbox-testcase-column19"]').click();
    cy.get('[data-cy="checkbox-testcase-column20"]').click();
    cy.get('[data-cy="checkbox-testcase-column21"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('#points').invoke('val', '8', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-preConditions"]').type(
      'new setup for testcasesnew setup for testcasesnew setup for testcases new setup for testcases new setup for testcases new setup for testcases new setup for testcases new setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcasesnew setup for testcases new setup for testcases new setup for testcases new setup for testcases',
    );
    cy.get('[data-cy="bulkedit-testSteps"]').type('teststeps for checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '18 Test Case Updated');
  });
  it.only('CCA-T-1157(Accessing the Bulk Edit Option as a Project Manager and verify that a Project Manager can access the "Bulk Edit" option for test cases.))', () => {
    // cy.get('[data-cy="project-header-testcases"]').click()
    // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    // // cy.scrollTo(0, 5000)

    // cy.get('[style="height: calc(100vh - 275px); overflow: auto;"]').scrollTo('bottom')
    //      easing: 'linear',
    //      duration: 2000
    //  })
    //  cy.wait(8000)
    // // cy.scrollTo(0, 500).wait(4000)
    //      cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
    //      cy.get('[data-cy="testcase-overall-checkbox"]').click({force: true})

    //  cy.get('[data-cy="testcase-overall-checkbox"]').click({force: true})
    cy.wait(5000);
    cy.get('[data-cy="table-data"]').scrollTo('bottom', {
      duration: 1000,
    });
    //  cy.get('testcase-table-id24').scrollIntoView({
    //     easing: 'linear'
    //  })
    //  cy.get('[style="testcase-table-id24"]').scrollTo('bottom');
    //  cy.get('.testcase-table-id24').should('be.visible').scrollTo('bottom');   cy.get('[data-cy="testcase-table-id24"] > p > ._textControl_1ipee_1')
    //  cy.get('testcase-table-id24').scrollIntoView({ offset: { top: 150, left: 0 } })
    // cy.get('[data-cy="testcase-table-id24"]').scrollIntoView({ offset: { top: 1000, left: 0 } })
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');

    // cy.get('[data-cy="testcase-table-id24"]').scrollIntoView().then(($el) => {
    //     // $el is the jQuery element that was scrolled into view
    //     // Now, you can use Cypress commands for additional scrolling
    //     cy.wrap($el).scrollTo('bottom');

    //      // cy.get('[data-cy="checkbox-testcase-column4"]').click()
    //      // cy.get('[data-cy="checkbox-testcase-column5"]').click()
    //   cy.get('[data-cy="testcases-bulkedit-btn"]').click()
    //      cy.get('[data-cy="bug-bulkedit-milestone"]').type("mile2{enter}")
    //      cy.get('[data-cy="bug-bulkedit-feature"]').type("feat1{enter}")
    //      cy.get('[data-cy="bug-bulkedit-testtype"]').type("security testing")
    //      cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    //      cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    //      cy.get('[data-cy="bulkedit-testSteps"]').type("teststeps for checking the functionality of bulk edit")
    //      cy.get('[data-cy="bulkedit-submit-btn"]').click()
    // cy.get(".Toastify").should('contain', "3 Test Case Updated");  testcase-table-id24
  });
});

describe('test cases wuth different scenarios', () => {
  it(' CCA-T-1169(Accessing Bulk Edit with No Test Cases Available and  verify that you cannot access bulk edit when there are no test cases available.))', () => {
    cy.login('aizaamir8@gmail.com', 'Admin@123');
    cy.visit('http://localhost:3000/projects');
    cy.get('[data-cy="clickonprojectmodule3"]').click();
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="testcases-bulkedit-btn"]').should('not.exist');
  });
  it('CCA-T-1161( Accessing Bulk Edit from Test Cases Tab of Project Module and verify that you can access the bulk edit functionality from the Test Cases tab of the Project module.))', () => {
    cy.login('aizaamir8@gmail.com', 'Admin@123');
    cy.visit('http://localhost:3000/projects');
    cy.get('[data-cy="clickonprojectmodule0"]').click();
    cy.get('[data-cy="project-header-testcases"]').click();
    cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist');
    cy.get('[data-cy="checkbox-testcase-column3"]').click();
    cy.get('[data-cy="checkbox-testcase-column4"]').click();
    cy.get('[data-cy="checkbox-testcase-column5"]').click();
    cy.get('[data-cy="testcases-bulkedit-btn"]').click();
    cy.get('[data-cy="bug-bulkedit-milestone"]').type('mile2{enter}');
    cy.get('[data-cy="bug-bulkedit-feature"]').type('feat1{enter}');
    cy.get('[data-cy="bug-bulkedit-testtype"]').type('security testing');
    cy.get('#points').invoke('val', '8', { force: true }).trigger('change', { force: true });
    cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
    cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
    cy.get('[data-cy="bulkedit-preConditions"]').type(
      'testcasesnew setup for testcasesnew setup for testcases new setup',
    );
    cy.get('[data-cy="bulkedit-testSteps"]').type('teststeps for checking the functionality of bulk edit');
    cy.get('[data-cy="bulkedit-submit-btn"]').click();
    cy.get('.Toastify').should('contain', '3 Test Case Updated');
  });
  //it('CCA-T-1157(Accessing the Bulk Edit Option as a Project Manager and verify that a Project Manager can access the "Bulk Edit" option for test cases.))', () => {
  // cy.visit(`${Cypress.env('crossCheckURL')}`);
  // cy.get('[data-cy="login-form-email-input"]').type('aizaamir8@gmail.com');
  // cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
  // cy.get('[data-cy="login-form-btn"]').click();
  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  // cy.get('[data-cy="sidebar-setting-btn-icon"]').click()
  // cy.get('[data-cy="sidebar-workspace-shortcuts"]').click()
  // cy.get('[data-cy="workspace-names-6526363838a45b7e2cc15854"]').click()
  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  // cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  // cy.get('[data-cy="clickonprojectmodule0"]').click()
  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')

  // cy.get('[data-cy="project-header-testcases"]').click()
  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  // // cy.scrollTo(0, 5000)

  // cy.get('[style="height: calc(100vh - 275px); overflow: auto;"]').scrollTo(('0%', '100%'),{
  //     easing: 'linear',
  //     duration: 2000
  // })
  // cy.wait(8000)
  // // cy.scrollTo(0, 500).wait(4000)
  // cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
  // cy.get('[data-cy="testcase-overall-checkbox"]').click({force: true})
  // // cy.get('[style="height: calc(100vh - 275px); overflow: auto;"]').scrollTo('bottom');
  //   // cy.get('[data-cy="testcase-overall-checkbox"]').click({force: true})

  //     // cy.get('[data-cy="checkbox-testcase-column4"]').click()
  //     // cy.get('[data-cy="checkbox-testcase-column5"]').click()
  //     cy.get('[data-cy="testcases-bulkedit-btn"]').click()
  //     cy.get('[data-cy="bug-bulkedit-milestone"]').type("mile2{enter}")
  //     cy.get('[data-cy="bug-bulkedit-feature"]').type("feat1{enter}")
  //     cy.get('[data-cy="bug-bulkedit-testtype"]').type("security testing")
  //     cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
  //     cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
  //     cy.get('[data-cy="bulkedit-testSteps"]').type("teststeps for checking the functionality of bulk edit")
  //     cy.get('[data-cy="bulkedit-submit-btn"]').click()
  //    // cy.get(".Toastify").should('contain', "3 Test Case Updated");

  // })
});
