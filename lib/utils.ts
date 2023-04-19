export const getRequestValue = (req: any, domain: string, key: string) => {
  if (req && req[domain]) {
    return Array.isArray(req[domain][key]) ? req[domain][key][0] : req[domain][key];
  }
  return undefined;
};

export const checkRequestBody = <T>(body: any, fields: string[]): body is T => {
  const checkResult = Object.keys(body).every((key) => fields.includes(key));
  console.log('checkResult:', checkResult)
  return Object.keys(body).every((key) => fields.includes(key));
  // return fields.every((field) => !!body[field]);
};
