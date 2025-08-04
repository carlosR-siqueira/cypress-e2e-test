import assert from 'assert'


class RegisterForm {
  elements = {
    titleInput: () => cy.get('#title'),
    titleFeedback: () => cy.get('#titleFeedback'),
    imageUrlInput: () => cy.get('#imageUrl'),
    urlFeedback: () => cy.get('#urlFeedback'),
    submitBtn: () => cy.get('#btnSubmit')
  }

  typeTitle(text) {
    if (!text) return
    this.elements.titleInput().type(text)
  }
  typeUrl(text) {
    if (!text) return
    this.elements.imageUrlInput().type(text)
  }
  clickSubmit() {
    this.elements.submitBtn().click()
  }
}

const colors = {
  errors: 'rgb(220, 53, 69)',
  success: ''
}

const imgFeedback = {
  errors: '',
  success: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e"
}

const registerForm = new RegisterForm()

describe('Image Registration', () => {
  describe('Submitting an image with invalid inputs', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })
    const input = {
      title: '',
      url: ''
    }
    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title)
    })

    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url)
    })
    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit()
    })
    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements.titleFeedback().should('contain.text', 'Please type a title for the image')
    })
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements.urlFeedback().should('contain.text', 'Please type a valid URL')
    })

    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element)
        const border = styles.getPropertyValue('border-right-color')
        assert.strictEqual(border, colors.errors)
      })
    })


  })

  describe('Submitting an image with valid inputs using enter key', () => {
    after(() => {
      cy.clearAllLocalStorage()
    })

    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
    })

    it(` When I enter ${input.title} in the title field`, () => {
      registerForm.typeTitle(input.title)
      registerForm.elements.titleInput().type('{enter}')
    })

    it('Then I should see a check icon in the title field', () => {
      registerForm.elements.titleInput().should('have.css', 'background-image', `url("${imgFeedback.success}")`)

    })
    it(` When I enter ${input.url} in the URL field`, () => {
      registerForm.typeUrl(input.url)
      
    })
    it('Then I should see a check icon in the title field', () => {
      registerForm.elements.imageUrlInput().should('have.css', 'background-image', `url("${imgFeedback.success}")`)

    })
    
  })
})