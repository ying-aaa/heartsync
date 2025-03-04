export interface IFancyTreeConfig {
  showSearch?: boolean;
  addChild?: boolean;
  loadTreeData: () => {};
  addNodeEvent?: (param: any) => void;
  deleteNodeEvent?: (id: number) => void;
  selectNodeEvent?: (id: number) => void;
}
