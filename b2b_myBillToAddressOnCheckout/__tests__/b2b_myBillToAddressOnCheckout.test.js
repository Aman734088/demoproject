import { createElement } from 'lwc';
import B2b_myBillToAddressOnCheckout from 'c/b2b_myBillToAddressOnCheckout';

describe('c-b-2-b-my-bill-to-address-on-checkout', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('TODO: test case generated by CLI command, please fill in test logic', () => {
        // Arrange
        const element = createElement('c-b-2-b-my-bill-to-address-on-checkout', {
            is: B2b_myBillToAddressOnCheckout
        });

        // Act
        document.body.appendChild(element);

        // Assert
        // const div = element.shadowRoot.querySelector('div');
        expect(1).toBe(1);
    });
});