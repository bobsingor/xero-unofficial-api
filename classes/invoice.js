const uuidv4 = require('uuid/v4');
const moment = require('moment');

class Invoice {
  constructor(invoiceNumber, defaultData, invoice = {}) {
    const id = uuidv4().toUpperCase();
    const currentDate = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSSSSS');

    this.defaultData = defaultData;

    this.invoice = {
      "invoiceStatus": "INVOICESTATUS/DRAFT",
      "invoiceType": "INVOICETYPE/ACCREC",
      "id": invoice.id || id,
      "displayDate": invoice.displayDate || currentDate,
      "invoiceNumber": invoiceNumber,
      "currency": invoice.currency || defaultData.currencies[0].id,
      "currencyName": invoice.currencyName || defaultData.currencies[0].name,
      "credited": null,
      "due": null,
      "newinvoice": false,
      "itemid": "",
      "paymentAccountID": null,
      "receiptNo": null,
      "hasTaxAdj": null,
      "fileStoreId": null,
      "dueDate": invoice.dueDate || currentDate,
      "brandingId": invoice.brandingId || defaultData.brandingThemes[0].id,
      "invoiceDate": invoice.invoiceDate || currentDate,
      "singleaccountname": "",
      "paid": null,
      "subTotalString": "",
      "gstType": "TAX/EXCLUSIVE",
      "total": 0,
      "status": null,
      "amountDue": null,
      "organisation_id": "",
      "sent": false,
      "overdue": null,
      "expitemqty": "",
      "contactID": invoice.contactID || null,
      "action": null,
      "contactName": invoice.contactName || null,
      "reference": invoice.reference || "",
      "discount": null,
      "lineItems": [],
      "readOnlyMsg": null
    }
  }

  getAccountById(accountId) {
    return this.defaultData.accounts.find((object) => {
      return object.code === accountId
    });
  }

  addLineItem(lineitem = {}) {
    let total = lineitem.unitAmount * lineitem.quantity;

    this.invoice.total = this.invoice.total + total;

    let account = this.getAccountById(lineitem.account);

    let lineItem = {
      "trackingItemId4": null,
      "trackingItemName4": "",
      "gstCode": "GST/NONE",
      "trackingItemName3": "",
      "defaultARTaxCode": null,
      "accountName": account.name,
      "gstName": "Tax Exempt (0%)",
      "lineAmount": total,
      "priceListItemName": null,
      "discount": null,
      "discountAmount": 0,
      "trackingItemId1": null,
      "discountTaxAmount": 0,
      "trackingItemName1": "",
      "trackingItemId2": null,
      "discountString": "0%",
      "trackingItemName2": "",
      "xindex": this.invoice.lineItems.length + 1,
      "id": uuidv4().toUpperCase(),
      "quantity": lineitem.quantity,
      "invoice_id": this.invoice.id,
      "isDescriptionLine": false,
      "trackingItemId3": null,
      "unitAmount": lineitem.unitAmount,
      "gstType": "TAX/EXCLUSIVE",
      "gstAmount": 0,
      "priceListItemId": null,
      "lineTotal": total,
      "isZeroDollarLine": false,
      "string": "",
      "accountId": account.id,
      "description": lineitem.description || ""
    }

    this.invoice.lineItems.push(lineItem)
  }
}

module.exports = Invoice