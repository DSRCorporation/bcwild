export const isStringValueInvalid = value => Boolean(!value);
export const isNumberValueInvalid = value => value === '' || value < 0;
export const isCheckboxesValueInvalid = options =>
  options.every(option => !option.checked);

export class ValidationError {
  constructor(message) {
    this.message = message;
  }
}

// transform: (value: any) => { ok: true; value: any } | { ok: false }
export const transformProperty = transform => (obj, property) => {
  const value = obj[property];
  const transformed = transform(value);
  if (transformed.ok) {
    return transformed.value;
  }
  throw new ValidationError(property);
};

export const ensureValidProperty = predicate =>
  transformProperty(value =>
    predicate(value) ? {ok: true, value} : {ok: false},
  );

export const ensureNonemptyStringProperty = ensureValidProperty(
  value => typeof value === 'string' && value,
);

export const ensureNonnegativeNumberProperty = ensureValidProperty(
  value => typeof value === 'number' && value >= 0,
);

export const datePropertyToTimestamp = transformProperty(value =>
  value instanceof Date ? {ok: true, value: value.getTime()} : {ok: false},
);

const tryParseFloat = value => {
  if (typeof value === 'number') {
    return value;
  }
  if (!(typeof value === 'string')) {
    return null;
  }
  const float = parseFloat(value);
  if (Number.isNaN(float)) {
    return null;
  }
  return float;
};

export const parseFloatProperty = transformProperty(value => {
  const float = tryParseFloat(value);
  if (float == null) {
    return {ok: false};
  }
  return {ok: true, value: float};
});

export const parseNonnegativeFloatProperty = transformProperty(value => {
  const float = tryParseFloat(value);
  if (float == null || float < 0) {
    return {ok: false};
  }
  return {ok: true, value: float};
});

export const parseFloatPropertyInRange = ({min, max}) =>
  transformProperty(value => {
    const float = tryParseFloat(value);
    const numMin = min != null ? min : Number.NEGATIVE_INFINITY;
    const numMax = max != null ? max : Number.POSITIVE_INFINITY;
    if (float == null || float < numMin || float > numMax) {
      return {ok: false};
    }
    return {ok: true, value: float};
  });

/*
transforms: Array<
  | { fromProperty: string, toProperty: string, transform?: (object, string) => any }
  | { property: string, transform?: (object, string) => any }
*/
export const applyPropertyTransforms = transforms => obj => {
  try {
    const endVal = {};
    transforms.forEach(spec => {
      const {property, transform} = spec;
      const {fromProperty, toProperty} =
        'property' in spec
          ? {fromProperty: property, toProperty: property}
          : spec;
      const toVal = transform
        ? transform(obj, fromProperty)
        : obj[fromProperty];
      endVal[toProperty] = toVal;
    });
    return {ok: true, value: endVal};
  } catch (error) {
    if (error instanceof ValidationError) {
      return {ok: false, errorMessage: error.message};
    }
    throw error;
  }
};
