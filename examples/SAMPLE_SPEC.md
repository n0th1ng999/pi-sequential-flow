# Sample Project Specification: Utility Functions

## SPEC-1: String Utilities
- Implement string manipulation helpers in `src/utils/strings.js` (or `.ts`):
  - `toKebabCase(str)`: Converts camelCase, PascalCase, or space/underscore separated strings into kebab-case.
  - `truncate(str, maxLength, suffix = "...")`: Truncates string to maxLength, appending suffix if truncated.
- Add comprehensive unit tests verifying normal strings, edge cases (empty strings, numbers, punctuation), and boundary conditions.

## SPEC-2: Math Utilities
- Implement numerical helpers in `src/utils/math.js` (or `.ts`):
  - `clamp(value, min, max)`: Restricts value within [min, max]. Throws if min > max.
  - `roundTo(value, decimals = 2)`: Accurately rounds a number to the specified number of decimal places.
- Add unit tests verifying normal values, negative ranges, zero, and edge cases.
