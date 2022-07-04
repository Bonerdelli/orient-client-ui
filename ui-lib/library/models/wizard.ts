export enum FrameWizardType {
  Simple,
  Full,
}

export interface FrameWizardStepResponse<T = Record<string, unknown>> {
  orderStatus: string
  step: number
  data: T
}

export interface FactoringWizardStepResponse<T> extends FrameWizardStepResponse<T> {
  offerStatus: string
}
