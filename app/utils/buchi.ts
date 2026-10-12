/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import db from '@adonisjs/lucid/services/db'

interface Input {
    field: string;
    type: string;
    value: any; // Can be string, number, boolean, or MultipartFile for 'file' type
}

interface Constraints {
    required?: boolean;
    min_length?: number;
    max_length?: number;
    char_length?: number;
    has_special_character?: boolean;
    must_have_number?: boolean;
    email?: boolean;
    must_match?: string;
    unique?: string;
    exists?: string;
    boolean?: boolean;
    max_size?: number; // Maximum file size in megabytes (MB)
    allowed_extensions?: string[]; // Allowed file extensions (e.g., ['jpg', 'png'])
    max_value?: number;
    min_value?: number;
    numeric?: boolean;
    in?: any[];
    date?: boolean;
    has_lowercase?: boolean;
    has_uppercase?: boolean;
    no_alphabeth?: boolean;
    not_future?: boolean;
    min_date?: string;
    max_date?: string;
}

export interface FieldObjects {
    input: Input;
    rules: Constraints;
    alias?: string | null;
}

interface FindCriteria {
    [key: string]: string | null; // Index signature allows string keys
}

const toSlug = (str: string, separator: string = '_'): string => {
    return str
        // Handle transitions like "userID" → "user_ID"
        .replace(/([a-z0-9])([A-Z])/g, "$1" + separator + "$2")
        // Handle transitions like "HTTPServer" → "HTTP_Server"
        .replace(/([A-Z])([A-Z][a-z])/g, "$1" + separator + "$2")
        .toLowerCase();
}

const getOriginalWordFromCompoundWord = (compound_word: string): string => {
    return compound_word?.replace('_', ' ');
}

const checkUniqueFieldInDB = async (input: Input, db_model: string): Promise<boolean> => {
    const soft_delete = process.env.SOFT_DELETE || false;
    const finder: FindCriteria = soft_delete ? { deleted_at: null } : {};

    let model_field = input.field;

    if (db_model.includes(":")) {
        const model_field_array = db_model.split(":");
        db_model = model_field_array[0];
        model_field = model_field_array[1];
    }

    finder[toSlug(model_field)] = input.value;
    const record = await db.from(db_model).where(finder);

    if (record && record.length > 0) {
        return true
    } else {
        return false
    }
}

const ensureFieldIsInDB = async (input: Input, db_model: string): Promise<boolean> => {
    const soft_delete = process.env.SOFT_DELETE || false;
    const finder: FindCriteria = soft_delete ? { deleted_at: null } : {};

    let model_field = input.field;

    if (db_model.includes(":")) {
        const model_field_array = db_model.split(":");
        db_model = model_field_array[0];
        model_field = model_field_array[1];
    }

    finder[toSlug(model_field)] = input.value;

    const record = await db.from(db_model).where(finder);

    if (record && record.length > 0) {
        return false
    } else {
        return true
    }
}

const parseDateOnly = (value: string): Date => {
    const datePart = value.split('T')[0]
    const [year, month, day] = datePart.split('-').map(Number)

    return new Date(year, month - 1, day)
}

const getTodayDateOnly = (): Date => {
    const now = new Date()

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    )
}

const runValidation = async (input: Input, constraints: Constraints, alias: string | null = null, fields: FieldObjects[]) => {
    const matchFinder = fields.find((field) => {
        return constraints?.must_match === field.input?.field;
    });

    if (input !== null) {
        const emailPattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
        const specialCharsRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const number = /[0-9]/g;
        const lowercase_pattern = /[a-z]/g;
        const uppercase_pattern = /[A-Z]/g;

        const rules = {
            required: {
                pass: constraints?.required === true ?
                    (input?.type === 'file' ? (input.value instanceof Object && input.value.tmpPath !== undefined && input.value.isValid) :
                        (
                            input?.type === 'number' ?
                                typeof input?.value === 'number' :
                                (input?.type === 'boolean' ? typeof input?.value === 'boolean' :
                                    (input?.value !== undefined && input?.value !== null && input?.value?.toString().trim().length > 0)
                                )
                        )
                    ) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " is required" : alias + " is required"
            },

            min_length: {
                pass: constraints.min_length ? (input?.value?.length > 0 ? input?.value?.length >= constraints?.min_length : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must have up to " + constraints?.min_length + " characters" : alias + " must have up to " + constraints?.min_length + " characters"
            },

            max_length: {
                pass: constraints.max_length ? (input?.value?.length > 0 ? input?.value?.length <= constraints?.max_length : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must not exceed " + constraints?.max_length + " characters" : alias + " must not exceed " + constraints?.max_length + " characters"
            },

            char_length: {
                pass: constraints.char_length ? (input?.value?.length > 0 ? input?.value?.length === constraints?.char_length : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must be " + constraints?.char_length + " characters" : alias + " must be " + constraints?.char_length + " characters"
            },

            email: {
                pass: constraints?.email === true && input?.value?.length > 0 ? emailPattern.test(input?.value) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must be a valid email" : alias + " must be a valid email"
            },

            has_special_character: {
                pass: constraints?.has_special_character === true && input?.value?.length > 0 ? specialCharsRegex.test(input?.value) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must have special character" : alias + " must have special character"
            },

            must_have_number: {
                pass: constraints?.hasOwnProperty('must_have_number') === true ? (input?.value?.length > 0 ? (constraints?.must_have_number === true ? number.test(input?.value) : true) : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must have a number" : alias + " must have a number"
            },

            numeric: {
                pass: constraints?.numeric === true ? (input?.value?.length > 0 ? number.test(input?.value) : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must be numeric" : alias + " must be numeric"
            },

            has_uppercase: {
                pass: constraints?.has_uppercase === true ? (input?.value?.length > 0 ? uppercase_pattern.test(input?.value) : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must have an uppercase letter" : alias + " must have an uppercase letter"
            },

            has_lowercase: {
                pass: constraints?.has_lowercase === true ? (input?.value?.length > 0 ? lowercase_pattern.test(input?.value) : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must have a lowercase letter" : alias + " must have a lowercase letter"
            },

            must_match: {
                pass: constraints?.hasOwnProperty('must_match') ? (input?.value?.length > 0 ? (matchFinder ? input?.value === matchFinder.input?.value : false) : true) : true,
                message: constraints?.must_match ? (alias === null ?
                    getOriginalWordFromCompoundWord(input?.field) + " does not match the " + getOriginalWordFromCompoundWord(constraints?.must_match) + " field"
                    :
                    alias + " does not match the " + getOriginalWordFromCompoundWord(constraints?.must_match) + " field") : "invalid field passed for matching"
            },

            unique: {
                pass: constraints.unique && input.value ? (await checkUniqueFieldInDB(input, constraints.unique) ? false : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " already taken" : alias + " already taken"
            },

            exists: {
                pass: constraints.exists && input.value ? (await ensureFieldIsInDB(input, constraints.exists) ? false : true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " Not found in database" : alias + " Not found in database"
            },

            boolean: {
                pass: constraints?.boolean === true ? typeof input?.value === "boolean" || input?.value === "0" || input?.value === "1" : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + " must be a boolean" : alias + " must be boolean"
            },

            max_size: {
                pass: constraints.max_size ?
                    (input.type === 'file' && input.value instanceof Object && input.value.size !== undefined ?
                        (input.value.size <= constraints.max_size * 1024 * 1024) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` file must not exceed ${constraints.max_size}MB` : alias + ` file must not exceed ${constraints.max_size}MB`
            },

            allowed_extensions: {
                pass: constraints.allowed_extensions ?
                    (input.type === 'file' && input.value instanceof Object && input.value.extname !== undefined ?
                        constraints.allowed_extensions.includes(input.value.extname) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` file must be of type(s): ${constraints.allowed_extensions?.join(', ')}` : alias + ` file must be of type(s): ${constraints.allowed_extensions?.join(', ')}`
            },

            max_value: {
                pass: constraints.max_value ?
                    (input.type === 'number' && input.value !== undefined ?
                        (input.value <= constraints.max_value) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` must not exceed ${constraints.max_value}` : alias + ` must not exceed ${constraints.max_value}`
            },

            min_value: {
                pass: constraints.min_value ?
                    (input.type === 'number' && input.value !== undefined ?
                        (input.value >= constraints.min_value) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` must not be less than ${constraints.min_value}` : alias + ` must not be less than ${constraints.min_value}`
            },

            date: {
                pass: constraints.date ?
                    (input.type === 'date' && input.value !== undefined ?
                        !Number.isNaN(Date.parse(input.value)) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` must be a valid date` : alias + ` must be a valid date`
            },

            in: {
                pass: constraints.in ?
                    (input.type === 'text' && input.value !== undefined ?
                        (constraints.in.includes(input.value)) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` must be one of ${constraints.in?.join(', ')}` : alias + ` must be one of ${constraints.in?.join(', ')}`
            },

            no_alphabeth: {
                pass: constraints.no_alphabeth ?
                    (input.type === 'text' && input.value !== undefined ?
                        (input.value.match(/[a-zA-Z]/) === null) :
                        true) : true,
                message: alias === null ? getOriginalWordFromCompoundWord(input?.field) + ` must not contain alphabeth` : alias + ` must not contain alphabeth`
            },

            not_future: {
                pass: constraints.not_future
                    ? (
                        input.type === 'date' && input.value !== undefined
                            ? parseDateOnly(input.value) <= getTodayDateOnly()
                            : true
                    )
                    : true,
                message:
                    alias === null
                        ? getOriginalWordFromCompoundWord(input.field) + ' cannot be a future date'
                        : alias + ' cannot be a future date'
            },

            min_date: {
                pass: constraints.min_date
                    ? (
                        input.type === 'date' && input.value !== undefined
                            ? parseDateOnly(input.value) >= parseDateOnly(constraints.min_date)
                            : true
                    )
                    : true,
                message:
                    alias === null
                        ? getOriginalWordFromCompoundWord(input.field) +
                        ` cannot be before ${constraints.min_date}`
                        : alias + ` cannot be before ${constraints.min_date}`
            },

            max_date: {
                pass: constraints.max_date
                    ? (
                        input.type === 'date' && input.value !== undefined
                            ? parseDateOnly(input.value) <= parseDateOnly(constraints.max_date)
                            : true
                    )
                    : true,
                message:
                    alias === null
                        ? getOriginalWordFromCompoundWord(input.field) +
                        ` cannot be after ${constraints.max_date}`
                        : alias + ` cannot be after ${constraints.max_date}`
            },
        };

        const feedback: { target: string; message: string }[] = [];

        for (let constraint in constraints) {
            if (constraints[constraint as keyof Constraints] !== undefined && constraints[constraint as keyof Constraints] !== null && rules.hasOwnProperty(constraint)) {
                const rule = rules[constraint as keyof typeof rules];
                if (rule.pass === false) {
                    feedback.push({
                        target: input?.field,
                        message: rule.message
                    });
                }
            } else if (!rules.hasOwnProperty(constraint)) {
                return {
                    status: 'fail',
                    error: `invalid rule "${constraint}"`
                };
            }
        }

        if (feedback.length === 0) {
            return {
                status: "success",
            };
        } else {
            return {
                status: "fail",
                feedback: feedback
            };
        }
    } else {
        return {
            status: "fail",
            error: `${input} cannot be null`
        };
    }
}

export const validate = async (fields: FieldObjects[]) => {
    const negatives: boolean[] = [];
    const errors: { target: string; message: string }[][] = [];
    for (const field of fields) {
        const result = await runValidation(field.input, field.rules, field.alias, fields);
        if (result.error) {
            negatives.push(false);
        } else if (result?.status === 'success') {
            negatives.push(true);
        } else if (result?.feedback) {
            negatives.push(false);
            errors.push(result.feedback);
        }
    }

    if (negatives.includes(false)) {
        const nestedArray: { target: string; message: string }[][] = errors;
        const groupedMessages: { [key: string]: string[] } = {};

        nestedArray.forEach(subarray => {
            subarray.forEach(item => {
                const { message, target } = item;
                if (!groupedMessages[target]) {
                    groupedMessages[target] = [message];
                } else {
                    groupedMessages[target].push(message);
                }
            });
        });

        return { status: false, errors: groupedMessages };
    } else {
        return { status: true };
    }
}

export const validateArrayOfObjects = async (
    items: any[],
    rulesBuilder: (item: any, index: number) => FieldObjects[]
) => {
    const errors: any[] = [];

    for (const [i, item] of items.entries()) {
        const fields = rulesBuilder(item, i);
        const result = await validate(fields);

        if (!result.status) {
            errors.push({ index: i, errors: result.errors });
        }
    }

    return errors.length > 0
        ? { status: false, errors }
        : { status: true };
}
