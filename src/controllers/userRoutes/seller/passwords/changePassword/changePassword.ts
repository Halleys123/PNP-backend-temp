import {
  Custom_error,
  Custom_response,
  async_error_handler,
  checkPasswords,
  hashPassword,
  sync_middleware_type,
} from '@himanshu_guptaorg/utils';
import { requestWithPermaSeller } from '../../../../../types/types';
import { SellerModelPerma } from '../../../../../models/seller/schema/sellerPerma';
import { sendMailViaThread } from '../../../../../utils/mail/sendMailViaThread';

const changePassword: sync_middleware_type = async_error_handler(
  async (req: requestWithPermaSeller, res, next) => {
    const { previousPassword, newPassword } = req.body;
    if (!previousPassword)
      throw new Custom_error({
        errors: [{ message: 'previousPasswordRequired' }],
        statusCode: 400,
      });
    if (!newPassword)
      throw new Custom_error({
        errors: [{ message: 'newPasswordRequired' }],
        statusCode: 400,
      });
    if (!(await checkPasswords(previousPassword, req.seller!.password)))
      throw new Custom_error({
        errors: [{ message: 'passwordDidNotMatch' }],
        statusCode: 400,
      });
    const hashedPassword = await hashPassword(newPassword);
    await SellerModelPerma.findByIdAndUpdate(req.seller!._id, {
      $set: { password: hashedPassword },
    });
    const { name, email } = req.seller!;

    sendMailViaThread({
      text: `Hi ${name} your passwoer has been successfully changed`,
      subject: 'Plants and Pots Paradise SignUp',
      from_info: 'Himanshu Gupta',
      toSendMail: email,
      cc: null,
      html: `<h1>Hi ${name} your passwoer has been successfully changed</h1>`,
      attachment: null,
    });
    next();
  }
);
export { changePassword };
