import {
  Custom_response,
  async_error_handler,
  sync_middleware_type,
} from "@himanshu_guptaorg/utils";
import { AdminModelPerma } from "../../../../models/admin/schema/adminPerma";
import { AdminType } from "../../../../models/admin/utils/common";

const getUnverifiedAdmins: sync_middleware_type = async_error_handler(
  async (req, res, next) => {
    const unverifiedAdmins = await AdminModelPerma.find({
      isVerifiedByMainAdmin: false,
      designation: { $ne: AdminType.MAIN_ADMIN },
    });
    const response = new Custom_response(
      true,
      null,
      {
        unverifiedAdmins,
      },
      "success",
      200,
      null
    );
    res.status(response.statusCode).json(response);
  }
);

export { getUnverifiedAdmins };
