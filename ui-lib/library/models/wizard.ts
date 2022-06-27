export enum FrameWizardType {
  Simple,
  Full,
}

export interface WizardStepResponse<T = Record<string, unknown>> {
  step: number
  data: T
}
