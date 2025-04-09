export interface IResourceScript {
  resourceUrl: string;
  isModule: boolean;
}

export interface ICodeWidgetConfig {
  id: string;
  templateHtml: string;
  templateCss: string;
  templateJs: string;
  resourceScript: Array<IResourceScript>;
}
