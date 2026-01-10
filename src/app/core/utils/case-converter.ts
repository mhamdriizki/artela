// Fungsi untuk mengubah string "snake_case" menjadi "camelCase"
const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

// Fungsi rekursif untuk mengubah Key dalam Object/Array
export const snakeToCamel = (o: any): any => {
  if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
    const n: any = {};
    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = snakeToCamel(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => snakeToCamel(i));
  }
  return o;
};
