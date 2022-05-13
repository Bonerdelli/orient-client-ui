import { CheckCircleOutlined } from '@ant-design/icons'

import { formatNumber } from 'orient-ui-library/library/helpers'

import portalConfig from 'config/portal.yaml'

const FRACTIONAL_LENGTH = portalConfig.dataDisplay.numberFractionalLength

type CellValue = boolean | string | number | null

export const renderBinaryCell = (value: CellValue): JSX.Element => (
  !!value ? <CheckCircleOutlined /> : <></>
)

export const renderNumericCell = (
  value: number | null
): JSX.Element => (
  value ? <>{formatNumber(value, FRACTIONAL_LENGTH)}</> : <></>
)
