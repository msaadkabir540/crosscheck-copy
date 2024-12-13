export const sortedData = (data, sortBy, sort) => {
  if (!sortBy || !sort) {
    return data;
  }

  const sortedData = [...data];

  sortedData.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'object' && typeof bValue === 'object') {
      const aNestedName = aValue.name ? aValue.name : aValue.text;
      const bNestedName = bValue.name ? bValue.name : bValue.text;

      if (sort === 'asc') {
        return naturalSort(aNestedName, bNestedName);
      } else if (sort === 'desc') {
        return naturalSort(bNestedName, aNestedName);
      }
    } else {
      if (sort === 'asc') {
        return naturalSort(aValue, bValue);
      } else if (sort === 'desc') {
        return naturalSort(bValue, aValue);
      }
    }

    return 0;
  });

  return sortedData;
};

const getNestedPropertyValue = (obj, path) => {
  let properties = path.split('.');
  let value = obj;

  if (properties.includes('length')) {
    properties = [properties[0]];
  }

  for (let prop of properties) {
    if (value && value[prop]) {
      value = value[prop];
    } else {
      return undefined;
    }
  }

  return value;
};

export const sortData = (data, sortBy, sort) => {
  if (!sortBy || !sort) {
    return data;
  }

  const sortedData = [...data];

  sortedData.sort((a, b) => {
    const aValue = getNestedPropertyValue(a, sortBy);
    const bValue = getNestedPropertyValue(b, sortBy);

    if (sort === 'asc') {
      return naturalSort(aValue, bValue);
    } else if (sort === 'desc') {
      return naturalSort(bValue, aValue);
    }

    return 0;
  });

  return sortedData;
};

const naturalSort = (a, b) => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  return collator.compare(a, b);
};
