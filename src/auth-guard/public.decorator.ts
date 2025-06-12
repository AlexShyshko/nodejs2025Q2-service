import { SetMetadata } from '@nestjs/common';

const Public = () => {
  return SetMetadata(process.env.IS_PUBLIC_KEY, true);
};

export { Public };
