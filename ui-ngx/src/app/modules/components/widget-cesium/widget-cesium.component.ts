import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ScriptLoaderService } from '@src/app/core/services/script-loader.service';
import { CesiumWidget, Viewer } from 'cesium';

declare var Cesium: any;

@Component({
  selector: 'hs-widget-cesium',
  templateUrl: './widget-cesium.component.html',
})
export class WidgetCesiumComponent implements OnInit, AfterViewInit {
  @Input() styles = { width: '100%', height: '100%' };

  cesiumInstance: TemplateRef<Element> | any =
    viewChild<ElementRef>('cesiumContainer');

  public viewer: Viewer;

  constructor(private scriptLoaderService: ScriptLoaderService) {}

  ngAfterViewInit() {
    this.loadResourceScript();
  }

  ngOnInit() {}

  public loadResourceScript() {
    const resourceUrls = ['Cesium.js', 'cesium-widgets.css'];
    this.scriptLoaderService.loadScripts(resourceUrls).subscribe((res) => {
      this.initCesium();
    });
  }

  initCesium() {
    const cesiumContainer = this.cesiumInstance().nativeElement;
    this.viewer = new Cesium.Viewer(cesiumContainer, {
      terrain: Cesium.Terrain.fromWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true,
      }),
      // geocoder: false,
      // infoBox: false,
      // skyAtmosphere: false,
      // homeButton: false, //隐藏视角返回初始位置按钮
      // sceneModePicker: false, //隐藏视角模式3D 2D CV
      // baseLayerPicker: false, //隐藏图层选择
      // navigationHelpButton: false, //隐藏帮助
      // animation: false, //隐藏动画控件
      // timeline: false, //隐藏时间线控件
      // fullscreenButton: false, //隐藏全屏
      contextOptions: {
        webgl: {
          alpha: true,
        },
      },
    });
    this.viewer.scene.skyBox.show = false; //关闭天空盒，否则会显示天空颜色
    // this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
    // this.viewer.scene.globe.enableLighting = true;
    // this.viewer.scene.globe.dynamicAtmosphereLighting = false;
    // this.viewer.scene.globe.enableLighting = false;
  }
}
