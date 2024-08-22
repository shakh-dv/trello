import {SetMetadata} from '@nestjs/common';

export const CheckOwnership = (entityType: string) =>
  SetMetadata('entityType', entityType);
