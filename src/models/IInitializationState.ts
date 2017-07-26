export interface InitializationState {
    pageName: string
    editToken?: string
    viewToken?: string
    viewOnly?: boolean
    isProd?: boolean
    error?: {
        code: number,
        message: string
    }
}