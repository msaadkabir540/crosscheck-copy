import { useState, useMemo, useCallback } from 'react';

export const useSearch = (initialData) => {
  const [searchTerm, setSearchTerm] = useState('');

  const deepSearch = useCallback((obj, term) => {
    if (!obj || !term) {
      return false;
    }

    if (Array.isArray(obj)) {
      for (const element of obj) {
        const result = deepSearch(element, term);
        if (result) return true;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        const result = deepSearch(obj[key], term);
        if (result) return true;
      }
    } else if (typeof obj === 'string' && obj.toLowerCase().includes(term)) {
      return true;
    } else if (typeof obj === 'number' && obj.toString().includes(term)) {
      return true;
    }

    return false;
  }, []);

  const filteredData = useMemo(() => {
    if (!initialData || !searchTerm.trim()) {
      return initialData;
    }

    let filtered;

    if (Array.isArray(initialData)) {
      filtered = initialData.filter((entry) => deepSearch(entry, searchTerm.toLowerCase()));
    } else {
      filtered = Object.keys(initialData).reduce((acc, key) => {
        const filteredItems = initialData[key].filter((entry) => deepSearch(entry, searchTerm.toLowerCase()));

        if (filteredItems.length > 0) {
          acc[key] = filteredItems;
        }

        return acc;
      }, {});
    }

    return filtered;
  }, [initialData, searchTerm, deepSearch]);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  return { searchTerm, filteredData, handleSearch };
};
