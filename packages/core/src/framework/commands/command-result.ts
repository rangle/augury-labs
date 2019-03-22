export interface CommandResult {
  success: boolean;
  errors?: any[];
  [actionSpecificKey: string]: any; // @todo: extend for eachcommand somehow
}
