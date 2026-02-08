import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { HsCodeWidgetEntity } from '../../../../database/entities/hs-code-widget.entity';
import { WidgetStrategy } from '../../model/widget-strategy.interface';
import { IWidgetType } from '@heartsync/types';
import { CreateCodeWidgetDto } from './dto/create-code-widget.dto';

@Injectable()
export class HsCodeWidgetsService implements WidgetStrategy {
  type = IWidgetType.CODE;

  constructor(
    @InjectRepository(HsCodeWidgetEntity)
    public widgetsRepository: Repository<HsCodeWidgetEntity>,
  ) {}

  async createWidget(
    createHsCodeWidgetDto: CreateCodeWidgetDto,
    manager?: EntityManager,
  ): Promise<HsCodeWidgetEntity> {
    const codeWidget = this.widgetsRepository.create(createHsCodeWidgetDto);
    return await (manager
      ? manager.save(codeWidget)
      : this.widgetsRepository.save(codeWidget));
  }

  async getAllHsCodeWidgets(): Promise<HsCodeWidgetEntity[]> {
    return await this.widgetsRepository.find();
  }

  async getWidgetById(
    id: string,
    manager?: EntityManager,
  ): Promise<HsCodeWidgetEntity> {
    const findLogic = async (manager: EntityManager) => {
      const widget = await manager.findOne(HsCodeWidgetEntity, {
        where: { id },
      });
      if (!widget) {
        throw new BadRequestException('部件不存在');
      }
      return widget;
    };
    if (manager) {
      return findLogic(manager);
    } else {
      return this.widgetsRepository.manager.transaction(async (manager) => {
        return findLogic(manager);
      });
    }
  }

  async updateWidget(
    id: string,
    updateHsCodeWidgetDto: any,
  ): Promise<HsCodeWidgetEntity> {
    await this.widgetsRepository.update(id, updateHsCodeWidgetDto);
    return await this.getWidgetById(id);
  }

  async deleteWidget(id: string): Promise<void> {
    await this.getWidgetById(id);
    await this.widgetsRepository.delete({ id });
  }
}
