import { CompanyDto } from 'orient-ui-library/library/models/proxy'
import { formatDate } from 'orient-ui-library/library/helpers/date'
import { formatCurrency } from 'orient-ui-library/library'

export const convertCompanyDtoToFormValues = (dto: CompanyDto) => {
  if (!dto) {
    return undefined
  }

  return {
    ...dto,
    isMsp: dto.isMsp ? 'Да' : 'Нет', // todo: add translations
    regDate: dto.regDate ? formatDate(dto.regDate) : '',
    capital: dto.capital ? formatCurrency(dto.capital) : null,
  }
}
