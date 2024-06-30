import { Custom_error, async_error_handler } from '@himanshu_guptaorg/utils';
import { requestWithPermaAdmin } from '../../../../types/types';
import { AdminType } from '../../../../models/admin/utils/common';

const isMainAdmin = async_error_handler(
  async (req: requestWithPermaAdmin, res, next) => {
    if (req.admin!.designation != AdminType.MAIN_ADMIN)
      throw new Custom_error({
        errors: [{ message: 'notMainAdmin' }],
        statusCode: 401,
      });
    next();
  }
);
export { isMainAdmin };
