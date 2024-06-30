import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermaAdmin } from '../../../../types/types';

const isLoggedIn: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaAdmin, res, next) => {
    const response = new Custom_response(
      true,
      null,
      req.admin,
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { isLoggedIn };
