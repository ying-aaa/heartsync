import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsFormWidget } from './form-widget.entity'; // 确保实体类名已改为 HsFormWidget

@Injectable()
export class HsFormWidgetsService {
  constructor(
    @InjectRepository(HsFormWidget)
    private formWidgetsRepository: Repository<HsFormWidget>,
  ) {}

  async createFormWidget(createFormWidgetDto: any): Promise<HsFormWidget[]> {
    const formWidget = this.formWidgetsRepository.create(createFormWidgetDto);
    return await this.formWidgetsRepository.save(formWidget);
  }

  async getAllFormWidgets(): Promise<HsFormWidget[]> {
    return await this.formWidgetsRepository.find();
  }

  async getFormWidgetById(id: number): Promise<HsFormWidget> {
    return await this.formWidgetsRepository.findOneBy({ id });
  }

  async updateFormWidget(
    id: number,
    updateFormWidgetDto: any,
  ): Promise<HsFormWidget> {
    await this.formWidgetsRepository.update(id, updateFormWidgetDto);
    return await this.getFormWidgetById(id);
  }

  async deleteFormWidget(id: number): Promise<void> {
    await this.formWidgetsRepository.delete(id);
  }
}
