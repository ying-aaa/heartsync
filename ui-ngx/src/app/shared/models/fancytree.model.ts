export interface IFancyTreeConfig {
  isDefaultFirst?: boolean;
  showSearch?: boolean;
  addChild?: boolean;
  init?: (data: any) => void;
  loadTreeData: () => {};
  addNodeEvent?: (param: any) => void;
  deleteNodeEvent?: (id: number) => void;
  defaultSelectNodeEvent?: (id: number) => void;
  renderTitle?: (event: Event, data: any) => string;
}
