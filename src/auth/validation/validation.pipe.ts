import { BadRequestException, PipeTransform, Type } from '@nestjs/common';
import { ZodSchema } from 'zod';

export interface ArgumentMetadata {
  type: 'body' | 'param' | 'query' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      console.log('validation from: ' + metadata.type);
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      console.log('error in validationing: ' + error);
      throw new BadRequestException();
    }
  }
}
