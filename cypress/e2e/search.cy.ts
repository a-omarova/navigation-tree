describe('search', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('display empty results', () => {
    cy.wait(1000).get('[data-test-search=input]').click().type('qwertyuiop')
    cy.get(`[data-test-search=emptyText]`).should('be.visible');
  })

  it('clear search', () => {
    cy.wait(1000).get('[data-test-search=input]').click().type('qwertyuiop')
    cy.get(`[data-test-search=clearButton]`).should('be.visible').click();
    cy.get(`[data-test-search=input]`).should('have.value', '');
  })

  it('show top level navigation on empty search', () => {
    cy.wait(1000).get('[data-test-search=input]').click().type('qwertyuiop')
    cy.get(`[data-test-search=clearButton]`).should('be.visible').click();
    cy.wait(1000).get('[data-test-navbar=navBar]').should('be.visible').click();
  })

  it('hide clear button on empty search', () => {
    cy.get(`[data-test-search=emptyText]`).should('not.exist')
    cy.wait(1000).get('[data-test-search=input]').click().type('qwertyuiop').clear()
    cy.get(`[data-test-search=emptyText]`).should('not.exist')
  })

})

export {}
