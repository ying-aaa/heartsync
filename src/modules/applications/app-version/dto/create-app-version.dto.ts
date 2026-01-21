import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateAppVersionDto {
  /** 应用ID */
  @IsString()
  @IsNotEmpty({ message: '应用ID不能为空' })
  appId: string;

  /** 版本号 */
  @IsString()
  @IsOptional()
  @MaxLength(32, { message: '版本号长度不能超过32位' })
  versionCode?: string = 'V1.0.0';

  /** 版本名称 */
  @IsString()
  @IsOptional()
  @MaxLength(128, { message: '版本名称长度不能超过128位' })
  versionName?: string = '初始版本';

  /** 版本描述 */
  @IsString()
  @IsOptional()
  @MaxLength(512, { message: '版本描述长度不能超过512位' })
  versionDesc?: string;
}
