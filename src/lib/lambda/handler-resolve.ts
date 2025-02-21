export const handlerPath = (
  context: string,
  defaultHandler = '/handler.handler',
  replacePrefix = true
) => {
  const path = `${context.split(process.cwd())[1]?.substring(1).replace(/\\/g, '/')}`;
  if (!replacePrefix) return path;
  return path.replace('services/apis/', '') + defaultHandler;
};
