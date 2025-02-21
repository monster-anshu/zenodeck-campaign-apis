export const handleEmail = async ({}: {
  to: string;
  from: string;
  subject: string;
  html: string;
  privatesKeys: {
    type: string;
    secret: string;
  };
}) => {};
