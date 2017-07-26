export interface InitializationState {
    pageName: string
    editToken?: string
    viewToken?: string
    viewOnly?: boolean
    error?: {
        code: number,
        message: string
    }
}