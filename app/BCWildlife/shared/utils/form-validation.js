export const isStringValueInvalid = value => Boolean(!value);
export const isNumberValueInvalid = value => value === '' || value < 0;
export const isCheckboxesValueInvalid = options =>
  options.every(option => !option.checked);
