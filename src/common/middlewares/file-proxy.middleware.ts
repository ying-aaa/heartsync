import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileProxyMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: Request, res: Response, next: Function) {
    if (req.path.startsWith('/heartsync-files')) {
      // 从 .env 文件中读取目标 URL
      const targetUrl = this.configService.get<string>('DB_HOST');
      const targetPort = this.configService.get<string>('DB_PORT');
      const proxyPath = req.path.replace('/heartsync-files', '');
      const fullTargetUrl = `${targetUrl}:${targetPort}${proxyPath}`;
      try {
        const response = await axios({
          method: req.method,
          url: fullTargetUrl,
          headers: req.headers,
          data: req.body,
          responseType: 'stream',
        });

        response.data.pipe(res);
      } catch (error) {
        res.status(500).send('Error forwarding request');
      }
    } else {
      next();
    }
  }
}
