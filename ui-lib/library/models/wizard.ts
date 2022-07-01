export enum FrameWizardType {
  Simple,
  Full,
}

export interface WizardStepResponse<T = Record<string, unknown>> {
  orderStatus: string
  step: number
  data: T
}
