import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MenuDesignerService {
  mousePosition = { x: 0, y: 0 };
  // 是否在拖拽中
  isDragging = signal<boolean>(false);

  // 显示单个菜单配置
  showSignleConfig = signal<boolean>(false);

  // 选中的菜单节点
  selectedNode = signal<any>({});

  constructor() {}

  onMouseMove(event: MouseEvent): void {
    this.mousePosition = { x: event.clientX, y: event.clientY };
  }

  toggleDragging(isDragging: boolean): void {
    this.isDragging.set(isDragging);
  }

  selectNode(node: any) {
    this.selectedNode.set(node || {});
    this.showSignleConfig.set(true);
  }

  toggleShowSignleConfig(showSignleConfig: boolean): void {
    this.showSignleConfig.set(showSignleConfig);
  }
}
