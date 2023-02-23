describe('theme', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('theme is changed after click', () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    cy.wait(1000).get('[data-test-theme-dark]').click().should('have.attr', 'data-test-theme-dark', `${!systemPrefersDark}`)
  })

})

export {}
