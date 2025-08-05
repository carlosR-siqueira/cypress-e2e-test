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

class RegisterList {
  elements = {
    article: () => cy.get('article'),
    cardList: () => cy.get('#card-list'),
    cardTitle: () => cy.get('card-title'),
    cardImgUrl: () => cy.get('card-img')
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
const registerList = new RegisterList()



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
        expect(border).to.equal(colors.errors)
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
    it('Then I can hit enter to submit the form', () => {
      registerForm.elements.imageUrlInput().type('{enter}')
    })
    it('And the list of registered images should be updated with the new item', () => {
      registerList.elements.article()
        .last()
        .should('contain', input.title)
        .find('img')
        .should('have.attr', 'src', input.url)
    })
    it('And the new item should be stored in the localStorage', () => {
      cy.window().then((win) => {
        const stored = JSON.parse(win.localStorage.getItem('tdd-ew-db'))
        expect(stored).to.be.an('array')
        const lastIten = stored[stored.length - 1]

        expect(lastIten.title).to.equal(input.title)
        expect(lastIten.imageUrl).to.equal(input.url)
      })
    })
    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')

    })

  })

  describe('Submitting an image and updating the list', () => {
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
    it(`Then I have entered ${input.title} in the title field`, () => {
      registerForm.typeTitle(input.title)
    })
    it(`Then I have entered ${input.url} in the title field`, () => {
      registerForm.typeUrl(input.url)
    })
    it('When I click the submit button', () => {
      registerForm.clickSubmit()
    })
    it('And the list of registered images should be updated with the new item', () => {
      registerList.elements.article()
        .last()
        .should('contain', input.title)
        .find('img')
        .should('have.attr', 'src', input.url)
    })
    it('And the new item should be stored in the localStorage', () => {
      cy.window().then((win) => {
        const stored = JSON.parse(win.localStorage.getItem('tdd-ew-db'))
        expect(stored).to.be.an('array')
        const lastIten = stored[stored.length - 1]

        expect(lastIten.title).to.equal(input.title)
        expect(lastIten.imageUrl).to.equal(input.url)
      })
    })
    it('Then The inputs should be cleared', () => {
      registerForm.elements.titleInput().should('have.value', '')
      registerForm.elements.imageUrlInput().should('have.value', '')
    })
  })
  describe('Refreshing the page after submitting an image clicking in the submit button', () => {
   

    const input = {
      title: 'Alien BR',
      url: 'https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg'
    }

    it('Given I am on the image registration page', () => {
      cy.visit('/')
      cy.window().then((win) => {
        win.localStorage.setItem('tdd-ew-db', JSON.stringify([
          {
            title: input.title,
            imageUrl: input.url
          }
        ]))
      })
    })

    it('Then I have submitted an image by clicking the submit button', () => {
      registerForm.typeTitle(input.title)
      registerForm.typeUrl(input.url)
      registerForm.clickSubmit()
    })
    it('When I refresh the page', () => {
      cy.reload()
    })
    it('Then I should still see the submitted image in the list of registered images', () => {
      registerList.elements.article()
        .last()
        .should('contain', input.title)
        .find('img')
        .should('have.attr', 'src', input.url)
    })

  })

})

