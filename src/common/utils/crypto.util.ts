import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.CRYPTO_SECRET || 'SECRET_KEY'; // 从环境变量获取密钥

// if (!SECRET_KEY) {
//   throw new Error('请在.env文件中配置CRYPTO_SECRET（加密密钥）');
// }

/**
 * 加密工具：用于安全存储数据源密码
 */
export class CryptoUtil {
  /**
   * 加密文本（如数据库密码）
   * @param text 待加密的明文
   * @returns 加密后的字符串
   */
  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  }

  /**
   * 解密密文
   * @param ciphertext 加密后的字符串
   * @returns 解密后的明文
   */
  static decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
