export const columnMapping = [
    { 
      key: "masterUniqueId", 
      label: "Product Identifier",
      width: "150px",
      sortFn: sortString,
      sticky: false
    },
    {
      key: "version",
      label: "Version",
      width: "120px",
      sticky: false,
    },
    {
      key: "product_name",
      label: "Name",
      width: "250px",
      sticky: false,
    },
    {
      key: "uniqueId",
      label: "UniqueId",
      width: "350px",
      sticky: false,
    },
    
];

export const sortableMapping = {
  masterUniqueId: {
    key: 'masterUniqueId',
    sortFn: sortString
  },
  base: {
    key: 'base',
    sortFn: sortString
  },
  'product_name': {
    key: 'product_name',
    sortFn: sortString
  },
  version: {
    key: 'version',
    sortFn: sortString
  },
};

function sortString(a, b) {
  if(typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  return String(a).localeCompare(String(b));
}