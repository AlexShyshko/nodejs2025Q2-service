import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const RawBody = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.body;
});

export { RawBody };
