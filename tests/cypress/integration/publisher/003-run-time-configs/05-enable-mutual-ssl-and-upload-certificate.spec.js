
describe("Runtime configuration", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    beforeEach(function () {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        cy.loginToPublisher(publisher, password);
    })

    it.only("Enable mutual ssl and upload cert", () => {
        const random_number = Math.floor(Date.now() / 1000);
        const alias = `alias${random_number}`;

        cy.createAPIByRestAPIDesign();
        cy.get('[data-testid="left-menu-itemRuntimeConfigurations"]').click();
        cy.get('[data-testid="transport-level-security-head"]').click();
        cy.get('[data-testid="mutual-ssl-checkbox"]').click();

        // uploading the cert
        cy.get('[data-testid="general-configuration-certs-add-btn"]').click();
        cy.get('[data-testid="select-policy-dropdown-input"]').click();
        cy.get('[data-testid="policy-item-Bronze"]').click();
        cy.get('[data-testid="certificate-alias-textbox"] input').click().type(alias);

        // upload the cert
        const filepath = 'api_artifacts/sample.crt.pem';
        cy.get('input[type="file"]').attachFile(filepath);

        // Click away
        cy.get('[data-testid="upload-cert-save-btn"]').click();
        cy.get('[data-testid="upload-cert-save-btn"]').then(() => {
            cy.get('[data-testid="save-runtime-configurations"]').click();
        })
        cy.get('[data-testid="save-runtime-configurations"]').get(() => {
            cy.get('[data-testid="transport-level-security-head"]').click();
            cy.get('[data-testid="mutual-ssl-checkbox"] input').should('be.checked');
            cy.get('[data-testid="endpoint-cert-list"]').contains(alias).should('be.visible');
        })
    });


    after(function () {
        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();

        cy.visit('carbon/user/user-mgt.jsp');
        cy.deleteUser(publisher);
    })
});