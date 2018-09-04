export interface CommandResult {
  success: boolean
  errors?: any[]
  [actionSpecificKey: string]: any
}
