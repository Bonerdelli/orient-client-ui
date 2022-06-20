import { CompanyHead } from 'library/models'

const mockData: CompanyHead[] = [
  {
    fullName: 'Ларионов Алексей Константинович',
    isExecutive: false,
    isAttorney: false,
    ownership: 13,
  },
  {
    fullName: 'Соколова Екатерина Руслановна',
    isExecutive: false,
    isAttorney: true,
    ownership: 0,
  },
  {
    fullName: 'Васильева Ксения Петровна',
    isExecutive: true,
    isAttorney: true,
    ownership: null,
  },
  {
    fullName: 'Дорохова София Никитична',
    isExecutive: false,
    isAttorney: true,
    ownership: 53.5,
  },
  {
    fullName: 'Федорова Софья Владиславовна',
    isExecutive: true,
    isAttorney: false,
    ownership: 6.66434382323,
  },
]

export default mockData
