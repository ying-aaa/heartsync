import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsCodeWidget } from './code-widget.entity';

@Injectable()
export class HsCodeWidgetsService {
  constructor(
    @InjectRepository(HsCodeWidget)
    private hsCodeWidgetsRepository: Repository<HsCodeWidget>,
  ) {}

  async createHsCodeWidget(createHsCodeWidgetDto: any): Promise<HsCodeWidget> {
    const hsCodeWidget = this.hsCodeWidgetsRepository.create(
      createHsCodeWidgetDto,
    );
    return await this.hsCodeWidgetsRepository.save(hsCodeWidget as any);
  }

  async getAllHsCodeWidgets(): Promise<HsCodeWidget[]> {
    return await this.hsCodeWidgetsRepository.find();
  }

  async getHsCodeWidgetById(id: number): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsRepository.findOneBy({ id });
  }

  async updateHsCodeWidget(
    id: number,
    updateHsCodeWidgetDto: any,
  ): Promise<HsCodeWidget> {
    await this.hsCodeWidgetsRepository.update(id, updateHsCodeWidgetDto);
    return await this.getHsCodeWidgetById(id);
  }

  async deleteHsCodeWidget(id: number): Promise<void> {
    await this.hsCodeWidgetsRepository.delete(id);
  }
}
