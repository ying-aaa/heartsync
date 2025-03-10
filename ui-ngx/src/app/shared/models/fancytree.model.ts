export interface IFancyTreeConfig {
  isDefaultFirst?: boolean;
  showSearch?: boolean;
  addChild?: boolean;
  loadTreeData: () => {};
  addNodeEvent?: (param: any) => void;
  deleteNodeEvent?: (id: number) => void;
  selectNodeEvent?: (id: number) => void;
  renderTitle?: (event: Event, data: any) => string;
}
