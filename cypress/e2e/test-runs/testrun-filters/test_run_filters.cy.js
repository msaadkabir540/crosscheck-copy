// describe("filters of test run test run", () => {
//     beforeEach(() => {
//        // cy.login('aizaamir8@gmail.com', 'Admin@123')
//         //cy.visit("http://localhost:3000/test-run");
//         cy.login(Cypress.env('loginEmail,loginPassword'))
//         cy.visit(`${Cypress.env('crossCheckURL')}test-run`);

//         cy.get('[data-cy="crosscheck-loader"]', { timeout: 2000 }).should('not.exist')

//     })
//     it('CCA-T-171,CCA-T-172,CCA-T-1455,CCA-T-1457,CCA-T-1458,CCA-T-1459,CCA-T-1460,CCA-T-1461,CCA-T-1462(the user can filter Test Runs based on different criteria)', () => {

//         cy.get('[data-cy="testrun-filter-btn"]').click()
//         cy.get('[data-cy="testrun-filtermodal-status-selectbox"]').type("open{enter}")
//         cy.get('[data-cy="testrun-filtermodal-assignedto-selectbox"]').type("aiza amir{enter}")
//         cy.get("#testrun-filtermodal-duedate").type("12/02/2023 - 12/02/2023{enter}")
//         cy.get('[data-cy="testrun-filtermodal-applybtn"]').click()
//        // cy.get(".testRuns_exportDiv__JWOCZ").contains("Filters")

//     })

// it('CCA-T-173 ( the user can reset the applied filters)', () => {

//     cy.get('[data-cy="testrun-filter-btn"]').click()
//     cy.get('[data-cy="testrun-filtermodal-status-selectbox"]').type("open{enter}")
//     cy.get('[data-cy="testrun-filtermodal-assignedto-selectbox"]').type("aiza amir{enter}")
//     cy.get("#testrun-filtermodal-duedate").type("12/02/2023 - 12/02/2023{enter}")
//     cy.get('[data-cy="testrun-filtermodal-resetbtn"]').click()

// })
// it.only('CCA-T-1456 (the filter modal contains the expected filter options.)', () => {

//     cy.get('[data-cy="testrun-filter-btn"]').click()
//     cy.get('[data-cy="filter-modal-testrun"]').contains("Status")
//     cy.get('[data-cy="filter-modal-testrun"]').contains("Assigned To")
//     cy.get('[data-cy="filter-modal-testrun"]').contains("Due Date")
//     cy.get('[data-cy="filter-modal-testrun"]').contains("Created Date")
//    cy.get('[data-cy="filter-modal-testrun"]').contains("Created By")
// })

// })
