import { HsBaseEntity } from 'src/database/entities/hs-base.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { RequestContext } from '../context/request.context';

@EventSubscriber()
export class BaseEntitySubscriber
  implements EntitySubscriberInterface<HsBaseEntity>
{
  listenTo() {
    return HsBaseEntity;
  }

  beforeInsert(event: InsertEvent<HsBaseEntity>) {
    const user = RequestContext.getCurrentUser();
    if (user && event.entity) {
      event.entity.createdBy = user.id;
      event.entity.updatedBy = user.id;
      event.entity.byDepartment = user.department;
    }
  }

  // 更新前触发
  beforeUpdate(event: UpdateEvent<HsBaseEntity>) {
    const user = RequestContext.getCurrentUser();
    if (user && event.entity) {
      event.entity.updatedBy = user.id;
    }
  }
}
