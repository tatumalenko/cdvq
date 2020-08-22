export interface FormField {
    key: string
    newKey?: string
    isList?: boolean
    transform?: (value: string) => string
}

export default interface FormParserConfig {
    formFields: FormField[]
}
