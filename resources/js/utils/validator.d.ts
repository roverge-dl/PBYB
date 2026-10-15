export interface ValidationInput {
  field: string;
  type: string;
  value: any;
  files?: object[];
}

export interface ValidationConstraints {
  required?: boolean;
  min_length?: number;
  max_length?: number;
  char_length?: number;
  has_special_character?: boolean;
  must_have_number?: boolean;
  email?: boolean;
  must_match?: string;
  boolean?: boolean;
  max_size?: number; // Maximum file size in megabytes (MB)
  allowed_extensions?: string[];
}

export interface ValidationFieldObject {
  input: ValidationInput;
  rules: ValidationConstraints;
  alias?: string | null;
}

export type ValidationErrors = Record<string, string[]>;

export interface ValidationSuccessResult {
  status: true;
}

export interface ValidationFailureResult {
  status: false;
  errors: ValidationErrors;
}

export type ValidationResult = ValidationSuccessResult | ValidationFailureResult;

export declare function getOriginalWordFromCompoundWord(compound_word: string): string;

export declare function buchiValidate(
  input: ValidationInput,
  constraints: ValidationConstraints,
  alias?: string | null,
  fields?: ValidationFieldObject[]
): Promise<{ status: 'success' } | { status: 'fail'; feedback?: Array<{ target: string; message: string }>; error?: string }>;

export declare function runValidation(
  fields: ValidationFieldObject[]
): Promise<ValidationResult>;

export default runValidation;
