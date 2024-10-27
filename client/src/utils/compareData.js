export function getChangedFields(newData, initialData) {
    const changedFields = {};
    
    Object.keys(newData).forEach((key) => {
      if (newData[key] !== initialData[key]) {
        changedFields[key] = newData[key];
      }
    });
  
    return changedFields;
  }

  export const checkDataChanged = (newData, oldData) => {
    return Object.keys(newData).some(key => newData[key] !== oldData[key]);
  };