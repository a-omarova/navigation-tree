const topLvlData = require('../fixtures/topLvl')

describe('navigation bar', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays top level', () => {
    cy
      .get('[data-test=navBar] li')
      .should('have.length', topLvlData.data.length)
  })

  it('is node with children open after click', () => {
    cy
      .get(`[data-test-haschildren=true]`)
      .each((elem) => {
        cy.wrap(elem).click()

        cy.wrap(elem).should('have.attr', 'data-test-open', 'true')
      })
  })

  it('is node with children close after double click', () => {
    cy
      .get(`[data-test-open=false]`)
      .each((elem) => {
        cy.wrap(elem).click()
        cy.wrap(elem).click()

        cy.wrap(elem).should('have.attr', 'data-test-open', 'false')
      })
  })

  it('displays next level', () => {
    cy.get(`[data-test-lvl=0]`).click({multiple: true})

    cy
      .get(`[data-test-lvl=0]`)
      .should('have.attr', 'data-test-haschildren', 'true')
      .next()
      .should('have.attr', 'data-test-lvl', '1')
  })

  it('displays preload', () => {
    cy.get(`[data-test-preload=navBarPreload]`).should('be.visible');
    cy.get(`[data-test-preload=navBarPreload]`).should('not.exist');
  })

  it('show loading icon after click on node with child', () => {
    cy.get(`[data-test-lvl=0]`).first().click()

    cy.get(`[data-test-loading=navBarNodeLoading]`).should('be.visible');
  })
})

export {}
