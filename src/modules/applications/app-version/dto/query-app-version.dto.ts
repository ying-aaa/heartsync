import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination.dto';

export class QueryAppVersionDto extends PageOptionsDto {
  /** 应用ID */
  @IsString({ message: '应用ID必须是字符串' })
  @IsNotEmpty({ message: '应用ID不能为空' })
  appId: string;

  /** 版本号 */
  @IsString()
  @IsOptional()
  @MaxLength(32, { message: '版本号长度不能超过32位' })
  versionCode?: string;

  /** 版本名称 */
  @IsString()
  @IsOptional()
  @MaxLength(128, { message: '版本名称长度不能超过128位' })
  versionName?: string;

  /** 版本描述 */
  @IsString()
  @IsOptional()
  @MaxLength(512, { message: '版本描述长度不能超过512位' })
  versionDesc?: string;
}
