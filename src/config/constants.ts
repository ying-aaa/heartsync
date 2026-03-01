import { IWidgetSettings } from '@heartsync/types';

export const widgetSettings: IWidgetSettings = {
  anableFullscreen: true,
  showTitle: true,
  showTitleIcon: false,
  title: '你好世界',
  titleTooltip: '',
  icon: '',
  containerStyle: {
    backgroundColor: 'var(--base-bg-color)',
    color: 'rgba(0, 0, 0, .87)',
    padding: '8px',
    borderRadius: '8px',
    boxShadow:
      'rgba(0, 0, 0, 0.05) 0px 0px 5px, rgba(16, 16, 16, 0.35) 0px 0px 20px -10px',
  },
  titleStyle: {
    lineHeight: '32px',
    padding: '0px',
  },
  iconStyle: {},
  widgetStyle: {},
};
