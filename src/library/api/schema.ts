/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/client/upload': {
    post: operations['upload']
  }
  '/client/company/requisites': {
    get: operations['founders']
    post: operations['saveRequisites']
  }
  '/client/company/founder': {
    get: operations['founders_1']
    post: operations['saveFounder']
  }
  '/client/company/contacts': {
    get: operations['contacts']
    post: operations['saveContacts']
  }
  '/auth/refresh': {
    post: operations['refresh']
  }
  '/auth/login': {
    post: operations['login']
  }
  '/operator': {
    get: operations['testOper']
  }
  '/dictionary/{name}': {
    get: operations['byKey']
  }
  '/dictionary/all': {
    get: operations['all']
  }
  '/common': {
    get: operations['testCommon']
  }
  '/client': {
    get: operations['testSupp']
  }
  '/client/file/{fileId}': {
    get: operations['get']
  }
  '/client/company': {
    get: operations['instance']
  }
  '/client/company/requisites/{id}': {
    get: operations['founder']
  }
  '/client/company/full': {
    get: operations['fullInstance']
  }
  '/client/company/founder/{id}': {
    get: operations['founder_1']
  }
}

export interface components {
  schemas: {
    ServerResponseUUID: {
      success: boolean
      /** Format: uuid */
      data?: string
    }
    CompanyRequisitesSaveRequest: {
      /** Format: int64 */
      id?: number
      bankName: string
      mfo: string
      accountNumber: string
    }
    JCompanyRequisites: {
      /** Format: int64 */
      id?: number
      /** Format: int64 */
      companyId?: number
      bankName?: string
      mfo?: string
      accountNumber?: string
    }
    ServerResponseJCompanyRequisites: {
      success: boolean
      data?: components['schemas']['JCompanyRequisites']
    }
    CompanyFounderSaveRequest: {
      /** Format: int64 */
      id?: number
      lastName: string
      firstName: string
      secondName?: string
      inn: string
      /** Format: double */
      ownership: number
      isIo: boolean
      isAttorney: boolean
      passportType: string
      passportSeries?: string
      passportNumber: string
      /** Format: date */
      passportIssueDate: string
      passportIssuePlace?: string
      passportIssuerCode: string
      passportIssuerName: string
      /** Format: date */
      birthdate: string
      birthplace: string
      isMaleGender: boolean
      /** Format: date */
      passportValidDate?: string
      nationality?: string
      address: string
    }
    JCompanyFounder: {
      /** Format: int64 */
      id?: number
      /** Format: date-time */
      createdAt?: string
      /** Format: date-time */
      updatedAt?: string
      /** Format: int64 */
      companyId?: number
      lastName?: string
      firstName?: string
      secondName?: string
      inn?: string
      /** Format: double */
      ownership?: number
      isIo?: boolean
      isAttorney?: boolean
      passportType?: string
      passportSeries?: string
      passportNumber?: string
      /** Format: date */
      passportIssueDate?: string
      passportIssuePlace?: string
      passportIssuerCode?: string
      passportIssuerName?: string
      /** Format: date */
      birthdate?: string
      birthplace?: string
      isMaleGender?: boolean
      /** Format: date */
      passportValidDate?: string
      nationality?: string
      address?: string
    }
    ServerResponseJCompanyFounder: {
      success: boolean
      data?: components['schemas']['JCompanyFounder']
    }
    CompanyContactsSaveRequest: {
      primaryEmail?: string
      additionalEmail?: string
      primaryPhone?: string
      additionalPhone?: string
    }
    JCompanyContacts: {
      /** Format: int64 */
      id?: number
      /** Format: date-time */
      createdAt?: string
      /** Format: date-time */
      updatedAt?: string
      /** Format: int64 */
      companyId?: number
      primaryEmail?: string
      additionalEmail?: string
      primaryPhone?: string
      additionalPhone?: string
    }
    ServerResponseJCompanyContacts: {
      success: boolean
      data?: components['schemas']['JCompanyContacts']
    }
    TokenRefreshDto: {
      refreshToken: string
    }
    AuthResponseDto: {
      accessToken: string
      refreshToken: string
    }
    ServerResponseAuthResponseDto: {
      success: boolean
      data?: components['schemas']['AuthResponseDto']
    }
    AuthRequestDto: {
      login: string
      password: string
    }
    ServerResponseLong: {
      success: boolean
      /** Format: int64 */
      data?: number
    }
    ServerResponseListObject: {
      success: boolean
      data?: { [key: string]: unknown }[]
    }
    ServerResponseMapStringListObject: {
      success: boolean
      data?: { [key: string]: { [key: string]: unknown }[] }
    }
    ServerResponseString: {
      success: boolean
      data?: string
    }
    JCompany: {
      /** Format: int64 */
      id?: number
      /** Format: date-time */
      createdAt?: string
      /** Format: date-time */
      updatedAt?: string
      /** Format: int64 */
      userId?: number
      fullName?: string
      shortName?: string
      inn?: string
      isMsp?: boolean
      capital?: number
      /** Format: int32 */
      currency?: number
      regAuthority?: string
      /** Format: date */
      regDate?: string
      regNumber?: string
      address?: string
      phones?: string
      email?: string
      opf?: string
      oked?: string
      soogu?: string
      soato?: string
      state?: string
    }
    ServerResponseJCompany: {
      success: boolean
      data?: components['schemas']['JCompany']
    }
    ServerResponseListJCompanyRequisites: {
      success: boolean
      data?: components['schemas']['JCompanyRequisites'][]
    }
    CompanyInstance: {
      company: components['schemas']['JCompany']
      contacts?: components['schemas']['JCompanyContacts']
      founders: components['schemas']['JCompanyFounder'][]
    }
    ServerResponseCompanyInstance: {
      success: boolean
      data?: components['schemas']['CompanyInstance']
    }
    ServerResponseListJCompanyFounder: {
      success: boolean
      data?: components['schemas']['JCompanyFounder'][]
    }
  }
}

export interface operations {
  upload: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseUUID']
        }
      }
    }
    requestBody: {
      content: {
        'multipart/form-data': {
          /** Format: binary */
          file: string
        }
      }
    }
  }
  founders: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseListJCompanyRequisites']
        }
      }
    }
  }
  saveRequisites: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompanyRequisites']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CompanyRequisitesSaveRequest']
      }
    }
  }
  founders_1: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseListJCompanyFounder']
        }
      }
    }
  }
  saveFounder: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompanyFounder']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CompanyFounderSaveRequest']
      }
    }
  }
  contacts: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompanyContacts']
        }
      }
    }
  }
  saveContacts: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompanyContacts']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CompanyContactsSaveRequest']
      }
    }
  }
  refresh: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseAuthResponseDto']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['TokenRefreshDto']
      }
    }
  }
  login: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseAuthResponseDto']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['AuthRequestDto']
      }
    }
  }
  testOper: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseLong']
        }
      }
    }
  }
  byKey: {
    parameters: {
      path: {
        name: string
      }
    }
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseListObject']
        }
      }
    }
  }
  all: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseMapStringListObject']
        }
      }
    }
  }
  testCommon: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseLong']
        }
      }
    }
  }
  testSupp: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseLong']
        }
      }
    }
  }
  get: {
    parameters: {
      path: {
        fileId: string
      }
    }
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseString']
        }
      }
    }
  }
  instance: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompany']
        }
      }
    }
  }
  founder: {
    parameters: {
      path: {
        id: number
      }
    }
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompanyRequisites']
        }
      }
    }
  }
  fullInstance: {
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseCompanyInstance']
        }
      }
    }
  }
  founder_1: {
    parameters: {
      path: {
        id: number
      }
    }
    responses: {
      /** OK */
      200: {
        content: {
          '*/*': components['schemas']['ServerResponseJCompanyFounder']
        }
      }
    }
  }
}

export interface external {}
