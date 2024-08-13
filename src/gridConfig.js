export const columnMapping = [
    { 
      key: "masterUniqueId", 
      label: "Product Identifier",
      width: "150px",
      sortFn: (a, b) => a.localeCompare(b),
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