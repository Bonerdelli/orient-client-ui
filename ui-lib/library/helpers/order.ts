import { OrderDocument } from 'library/models/order'

export const checkDocumentSignNeeded = (document?: OrderDocument) => {
  if (!document?.info) {
    return false
  }
  const {
    needClientSign,
    needBankSign,
    needCustomerSign,
  } = document.info
  return needClientSign || needBankSign || needCustomerSign
}

export const checkDocumentSigned = (document?: OrderDocument) => {
  if (!document?.info) {
    return false
  }
  const {
    needClientSign,
    needBankSign,
    needCustomerSign,
    clientSigned,
    bankSigned,
    customerSigned,
  } = document.info
  const statusClient = needClientSign ? Boolean(clientSigned) : true
  const statusBank = needBankSign ? Boolean(bankSigned) : true
  const statusCustomer = needCustomerSign ? Boolean(customerSigned) : true
  return statusClient && statusBank && statusCustomer
}
