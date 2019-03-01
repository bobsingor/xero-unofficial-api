class Contact {
  constructor(contact = {}) {
    this.contact = {
      "defaultAPTrackingID3": contact.defaultAPTrackingID3 || null,
      "arAmountDue": contact.arAmountDue || null,
      "contactTypeCode": contact.arAmountDue || null,
      "defaultAPTrackingItemName3": contact.defaultAPTrackingItemName3 || null,
      "companyNumber": contact.companyNumber || null,
      "id": contact.id || null,
      "bankReferenceField2": contact.bankReferenceField2 || null,
      "defaultAPTrackingID1": contact.defaultAPTrackingID1 || null,
      "arDaysToPay": contact.arDaysToPay || null,
      "authKey": contact.authKey || null,
      "defaultCurrencyCode": contact.defaultCurrencyCode || null,
      "defaultInvoiceBrandingId": contact.defaultInvoiceBrandingId || null,
      "gstNumber": contact.gstNumber || null,
      "defaultAPTrackingID2": contact.defaultAPTrackingID2 || null,
      "defaultAPTrackingItemName4": contact.defaultAPTrackingItemName4 || null,
      "bankAccountName": contact.bankAccountName || null,
      "defaultAPTrackingItemName1": contact.defaultAPTrackingItemName1 || null,
      "billDueNo": contact.billDueNo || null,
      "bankReferenceField3": contact.bankReferenceField3 || null,
      "chequeContactName": contact.chequeContactName || null,
      "accountNumber": contact.accountNumber || null,
      "emailAddress": contact.emailAddress || null,
      "arOverdue": contact.arOverdue || null,
      "defaultARTrackingID4": contact.defaultARTrackingID4 || null,
      "defaultARTrackingID1": contact.defaultARTrackingID1 || null,
      "bankReferenceField1": contact.bankReferenceField1 || null,
      "invDueType": contact.invDueType || null,
      "skypeUsername": contact.skypeUsername || null,
      "lastName": contact.lastName || null,
      "bankAccountDetails": contact.bankAccountDetails || null,
      "name": contact.name || null,
      "defaultARTrackingItemName2": contact.defaultARTrackingItemName2 || null,
      "defaultARAccountID": contact.defaultARAccountID || null,
      "invDueNo": contact.invDueNo || null,
      "contactStatusCode": "CONSTATUS/ACTIVE",
      "defaultAPTrackingID4": contact.defaultAPTrackingID4 || null,
      "taxNumberType": contact.taxNumberType || null,
      "firstName": contact.firstName || null,
      "apOverdue": contact.apOverdue || null,
      "defaultAPTrackingItemName2": contact.defaultAPTrackingItemName2 || null,
      "defaultARTrackingID3": contact.defaultARTrackingID3 || null,
      "defaultARTrackingID2": contact.defaultARTrackingID2 || null,
      "addresses": [{
        "id": null,
        "addressLine4": null,
        "addressLine3": null,
        "city": null,
        "countryCode": null,
        "latitude": null,
        "longitude": null,
        "type": "ADDRESS/POBOX",
        "addressLine2": null,
        "region": null,
        "postCode": null,
        "addressLine1": null
      }, {
        "id": null,
        "addressLine4": null,
        "addressLine3": null,
        "city": null,
        "countryCode": null,
        "latitude": null,
        "longitude": null,
        "type": "ADDRESS/STREET",
        "addressLine2": null,
        "region": null,
        "postCode": null,
        "addressLine1": null
      }],
      "defaultARTrackingItemName4": contact.defaultARTrackingItemName4 || null,
      "phones": [{
        "areaCode": null,
        "countryCode": null,
        "phoneNumber": null,
        "id": null,
        "type": "PHONE/DEFAULT"
      }, {
        "areaCode": "",
        "countryCode": "",
        "phoneNumber": "",
        "id": null,
        "type": "PHONE/DDI"
      }, {
        "areaCode": "",
        "countryCode": "",
        "phoneNumber": "",
        "id": null,
        "type": "PHONE/MOBILE"
      }, {
        "areaCode": "",
        "countryCode": "",
        "phoneNumber": "",
        "id": null,
        "type": "PHONE/FAX"
      }],
      "defaultAPAccountID": contact.defaultAPAccountID || null,
      "discount": contact.discount || null,
      "billDueType": contact.billDueType || null,
      "defaultARTrackingItemName3": contact.defaultARTrackingItemName3 || null,
      "defaultARTaxCode": contact.defaultARTaxCode || null,
      "apAmountDue": contact.apAmountDue || null,
      "website": contact.website || null,
      "defaultARTrackingItemName1": contact.defaultARTrackingItemName1 || null,
      "defaultAPTaxCode": contact.defaultAPTaxCode || null
    }
  }

  setPostAddress(address = {}) {
    this.contact.addresses[0].addressLine1 = address.addressLine1 || null
    this.contact.addresses[0].addressLine2 = address.addressLine2 || null
    this.contact.addresses[0].addressLine3 = address.addressLine3 || null
    this.contact.addresses[0].addressLine4 = address.addressLine4 || null
    this.contact.addresses[0].postCode = address.postCode || null
    this.contact.addresses[0].city = address.city || null
    this.contact.addresses[0].region = address.region || null
    this.contact.addresses[0].countryCode = address.countryCode || null
  }

  setDefaultPhone(phone = {}) {
    this.contact.phones[0].areaCode = phone.areaCode || null
    this.contact.phones[0].countryCode = phone.countryCode || null
    this.contact.phones[0].phoneNumber = phone.phoneNumber || null
  }
}

module.exports = Contact