// describe("bulk edit of testcases", () => {
//     // beforeEach(() => {
//     //     cy.login(Cypress.env('loginEmail,loginPassword'))
//     //     cy.visit(`${Cypress.env('crossCheckURL')}test-cases`);
//     //     cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//     //     cy.intercept({
//     //         url: "**/my-workspaces",
//     //         method: "GET"
//     //     }).as("testcasepage")
//     //     cy.wait("@testcasepage")
//     //     cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//     // })
//     it('CCA-T-1157(Accessing the Bulk Edit Option as a Project Manager and verify that a Project Manager can access the "Bulk Edit" option for test cases.))', () => {
//         cy.visit(`${Cypress.env('crossCheckURL')}`);
//         cy.get('[data-cy="login-form-email-input"]').type('aizaamir8@gmail.com');
//         cy.get('[data-cy="login-form-password-input"]').type('Admin@123');
//         cy.get('[data-cy="login-form-btn"]').click();
//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//         cy.get('[data-cy="sidebar-setting-btn-icon"]').click()
//         cy.get('[data-cy="sidebar-workspace-shortcuts"]').click()
//         cy.get('[data-cy="workspace-names-6526363838a45b7e2cc15854"]').click()
//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//         cy.get('[data-cy="dashboard-sidebar-project-icon1"]').click()
//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//         cy.get('[data-cy="clickonprojectmodule0"]').click()
//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')

//         cy.get('[data-cy="project-header-testcases"]').click()
//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//         // cy.scrollTo(0, 5000)

//         cy.get('[style="height: calc(100vh - 275px); overflow: auto;"]').scrollTo(('0%', '100%'),{
//             easing: 'linear',
//             duration: 2000
//         })
//         cy.wait(8000)
//         // cy.scrollTo(0, 500).wait(4000)
//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 5000 }).should('not.exist')
//         cy.get('[data-cy="testcase-overall-checkbox"]').click({force: true})
//         // cy.get('[style="height: calc(100vh - 275px); overflow: auto;"]').scrollTo('bottom');
//       // cy.get('[data-cy="testcase-overall-checkbox"]').click({force: true})

//         // cy.get('[data-cy="checkbox-testcase-column4"]').click()
//         // cy.get('[data-cy="checkbox-testcase-column5"]').click()
//         cy.get('[data-cy="testcases-bulkedit-btn"]').click()
//         cy.get('[data-cy="bug-bulkedit-milestone"]').type("mile2{enter}")
//         cy.get('[data-cy="bug-bulkedit-feature"]').type("feat1{enter}")
//         cy.get('[data-cy="bug-bulkedit-testtype"]').type("security testing")
//         cy.get('[data-cy="bulkedit-bug-ticketID"]').click().type('CCA-22');
//         cy.get('[data-cy="bug-bulkedit-state"]').click().type('Active{enter}');
//         cy.get('[data-cy="bulkedit-testSteps"]').type("teststeps for checking the functionality of bulk edit")
//         cy.get('[data-cy="bulkedit-submit-btn"]').click()
//        // cy.get(".Toastify").should('contain', "3 Test Case Updated");

//     })
// })
