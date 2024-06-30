import {
  Custom_response,
  async_error_handler,
  createJwt,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import {
  requestWithPermaAdminAndSession,
  roles,
} from '../../../../types/types';
import { SessionModel } from '../../../../models/sessions/schema/sesssions';
const getNewAccessToken: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaAdminAndSession, res, next) => {
    const permaUser = req.admin;
    const accessToken = await createJwt(
      {
        payload: { _id: permaUser!._id, role: roles.ADMIN },
        options: {
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!
    );
    const refreshToken: string = (await createJwt(
      {
        payload: { _id: permaUser!._id, role: roles.ADMIN },
        options: {
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        },
      },
      process.env.REFRESH_TOKEN_SECRET!
    )) as string;
    await SessionModel.findByIdAndUpdate(req.session!._id, {
      $set: { refreshToken },
    });
    const response = new Custom_response(
      true,
      null,
      { refreshToken, accessToken },
      'success',
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);
export { getNewAccessToken };
