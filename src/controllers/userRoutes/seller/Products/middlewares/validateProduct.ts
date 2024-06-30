import {
  Custom_error,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { descriptionType } from '../../../../../types/types';

type DescriptionInfo = {
  descriptionType: descriptionType;
  value: string[];
};

type Description = {
  heading: string;
  info: DescriptionInfo[];
};

const validateDescription = (
  description: any
): description is Description[] => {
  if (!Array.isArray(description)) return false;

  for (const desc of description) {
    if (typeof desc.heading !== 'string') return false;
    if (!Array.isArray(desc.info)) return false;

    for (const info of desc.info) {
      if (typeof info.descriptionType !== 'string') return false;
      if (!Array.isArray(info.value)) return false;
      if (!info.value.every((val: any) => typeof val === 'string'))
        return false;
    }
  }
  return true;
};

const validateProduct: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const {
      name,
      description = '',
      price,
      category,
      stock = 1,
      images = [],
      tags,
    } = req.body;
if (!name) {
      throw new Custom_error({
        errors: [{ message: 'sendName' }],
        statusCode: 400,
      });
    }

    if (!price) {
      throw new Custom_error({
        errors: [{ message: 'sendPrice' }],
        statusCode: 400,
      });
    }

    if (!category) {
      throw new Custom_error({
        errors: [{ message: 'categoryMustBeProvided' }],
        statusCode: 400,
      });
    }

    if (!description) {
      throw new Custom_error({
        errors: [{ message: 'descriptionRequired' }],
        statusCode: 400,
      });
    }

    if (!validateDescription(description)) {
      throw new Custom_error({
        errors: [{ message: 'invalidDescriptionFormat' }],
        statusCode: 400,
      });
    }

    next();
  }
);

export { validateProduct };
