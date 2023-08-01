export const transformListDataToCheckboxItems = (data = []) =>
  data.map(item => ({label: item.value, value: item.id, checked: false}));
