/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalizes snake_case or compound words for user-friendly error messages
 * @param {string} compound_word
 * @returns {string}
 */
const getOriginalWordFromCompoundWord = (compound_word) => {
  return compound_word?.replace(/_/g, " ");
};

/**
 * Validates a single field against its constraints
 * @param {object} input - { field, type, value, files? }
 * @param {object} constraints - { required, min_length, max_length, char_length, email, has_special_character, must_have_number, must_match, boolean, max_size, allowed_extensions }
 * @param {string|null} alias - user-friendly label (e.g. "Email address")
 * @param {Array} fields - array of all field objects for cross-field matching
 * @returns {Promise<object>}
 */
const buchiValidate = async (
  input,
  constraints,
  alias = null,
  fields = []
) => {
  const matchFinder = fields?.find((field) => {
    return constraints?.must_match === field.input?.field;
  });

  if (input !== null && input !== undefined) {
    // REGEX for valid email fields (robust RFC-compliant subset)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // REGEX for special character fields
    const specialCharsRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    // REGEX for digits
    const number = /[0-9]/;

    // Rules Definition
    const rules = {
      required: {
        pass:
          constraints?.required === true
            ? input?.type === "file"
              ? typeof File !== "undefined" && input.value instanceof File && input.value.size > 0
              : input?.type === "number"
              ? input?.value !== null && input?.value !== undefined && String(input?.value).length > 0
              : input?.type === "boolean"
              ? typeof input?.value === "boolean"
              : input?.value !== null && input?.value !== undefined && String(input?.value).trim().length > 0
            : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) + " is required"
            : alias + " is required",
      },
      min_length: {
        pass: constraints.min_length
          ? input?.value && String(input?.value).length > 0
            ? String(input?.value).length >= constraints?.min_length
            : true
          : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must have up to " +
              constraints?.min_length +
              " characters"
            : alias +
              " must have up to " +
              constraints?.min_length +
              " characters",
      },
      max_length: {
        pass: constraints.max_length
          ? input?.value && String(input?.value).length > 0
            ? String(input?.value).length <= constraints?.max_length
            : true
          : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must not exceed " +
              constraints?.max_length +
              " characters"
            : alias +
              " must not exceed " +
              constraints?.max_length +
              " characters",
      },
      char_length: {
        pass: constraints.char_length
          ? input?.value && String(input?.value).length > 0
            ? String(input?.value).length === constraints?.char_length
            : true
          : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must be " +
              constraints?.char_length +
              " characters"
            : alias + " must be " + constraints?.char_length + " characters",
      },
      email: {
        pass:
          constraints?.email === true && input?.value && String(input?.value).length > 0
            ? emailPattern.test(String(input?.value).trim())
            : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must be a valid email"
            : alias + " must be a valid email",
      },
      has_special_character: {
        pass:
          constraints?.has_special_character === true &&
          input?.value && String(input?.value).length > 0
            ? specialCharsRegex.test(String(input?.value))
            : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must have special character"
            : alias + " must have special character",
      },
      must_have_number: {
        pass:
          Object.prototype.hasOwnProperty.call(constraints || {}, "must_have_number") === true
            ? input?.value && String(input?.value).length > 0
              ? constraints?.must_have_number === true
                ? number.test(String(input?.value))
                : true
              : true
            : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must have a number"
            : alias + " must have a number",
      },
      must_match: {
        pass: Object.prototype.hasOwnProperty.call(constraints || {}, "must_match")
          ? input?.value && String(input?.value).length > 0
            ? matchFinder
              ? input?.value === matchFinder.input?.value
              : false
            : true
          : true,
        message: constraints?.must_match
          ? alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " does not match the " +
              getOriginalWordFromCompoundWord(constraints?.must_match) +
              " field"
            : alias +
              " does not match the " +
              getOriginalWordFromCompoundWord(constraints?.must_match) +
              " field"
          : "invalid field passed for matching",
      },
      boolean: {
        pass:
          constraints?.boolean === true
            ? typeof input?.value === "boolean" ||
              input?.value === "0" ||
              input?.value === "1"
            : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              " must be a boolean"
            : alias + " must be boolean",
      },
      max_size: {
        pass: constraints.max_size
          ? input.type === "file" &&
            typeof File !== "undefined" &&
            input.value instanceof File &&
            input.value.size !== undefined
            ? input.value.size <= constraints.max_size * 1024 * 1024 // Convert MB to bytes
            : true
          : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              ` file must not exceed ${constraints.max_size}MB`
            : alias + ` file must not exceed ${constraints.max_size}MB`,
      },
      allowed_extensions: {
        pass: constraints.allowed_extensions
          ? input.type === "file" &&
            typeof File !== "undefined" &&
            input.value instanceof File &&
            input.value.name !== undefined
            ? constraints.allowed_extensions.includes(
                input.value.name.split(".").pop()?.toLowerCase() || ""
              )
            : true
          : true,
        message:
          alias === null || alias === undefined
            ? getOriginalWordFromCompoundWord(input?.field) +
              ` file must be of type(s): ${constraints.allowed_extensions?.join(
                ", "
              )}`
            : alias +
              ` file must be of type(s): ${constraints.allowed_extensions?.join(
                ", "
              )}`,
      },
    };

    const feedback = [];

    for (const constraint in constraints) {
      if (Object.prototype.hasOwnProperty.call(rules, constraint)) {
        const rule = rules[constraint];
        if (rule.pass === false) {
          feedback.push({
            target: input?.field,
            message: rule.message,
          });
        }
      } else {
        return {
          status: "fail",
          error: `invalid rule "${constraint}"`,
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
        feedback: feedback,
      };
    }
  } else {
    return {
      status: "fail",
      error: `${input} cannot be null`,
    };
  }
};

/**
 * Runs validation across an array of field objects
 * @param {Array<{ input: object, rules: object, alias?: string }>} fields
 * @returns {Promise<{ status: boolean, errors?: Record<string, string[]> }>}
 */
const runValidation = async (fields) => {
  const negatives = [];
  const errors = [];
  for (const field of fields) {
    const result = await buchiValidate(
      field.input,
      field.rules,
      field.alias,
      fields
    );
    if (result.error) {
      negatives.push(false);
    } else if (result?.status === "success") {
      negatives.push(true);
    } else if (result?.feedback) {
      negatives.push(false);
      errors.push(result.feedback);
    }
  }

  if (negatives.includes(false)) {
    const groupedMessages = {};

    errors.forEach((subarray) => {
      subarray.forEach((item) => {
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
};

export { runValidation, buchiValidate, getOriginalWordFromCompoundWord };
export default runValidation;
