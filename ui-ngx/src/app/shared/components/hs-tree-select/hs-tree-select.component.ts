import { OverlayModule } from '@angular/cdk/overlay';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { flattenTree } from '@src/app/core/utils';

@Component({
  selector: 'hs-tree-select',
  templateUrl: './hs-tree-select.component.html',
  styleUrls: ['./hs-tree-select.component.less'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true,
    },
  ],
})
export class TreeSelectComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  @ViewChild('formFieldRef') formFieldRef: MatFormField;
  @ViewChild('overlayElement') overlayElement: ElementRef;
  @ViewChild('searchInputRef') searchInputRef: ElementRef;

  @Input() nodes: Array<any> = [];
  @Input() key = 'id';
  @Input() filter = true;
  @Input() placeholder = '';
  @Input() label = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() readonly = false;
  @Input() multiple = false;
  @Input() errorState = false;
  @Input() value: any;

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  // 用于存储搜索输入框的值
  searchControl = new FormControl('');
  // 单选时的信号值
  selectedValue = signal<string | null>(null);
  // 多选时的信号值
  selectedValues = signal<string[]>([]);
  // 控制下拉框的打开和关闭状态
  isOpenOverlay = signal(false);
  // 用于存储 form-field 的宽度
  formFieldRefWidth: number;

  treeControl = new NestedTreeControl<any>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<any>();

  selectedValuesStr = computed(() => {
    const values = this.selectedValues();
    console.log('%c Line:98 🍐 values', 'color:#6ec1c2', values);
    return values.join(',');
  });

  constructor() {
    this.searchControl.valueChanges.subscribe((searchString: string | null) => {
      this.filterTree(searchString || '');
    });
  }

  filterTree(searchString: string) {
    if (!searchString) {
      this.dataSource.data = this.nodes;
      return;
    }

    const filteredData = this.nodes.map((node) =>
      this.filterNode(node, searchString),
    );
    this.dataSource.data = filteredData.filter(
      (node) => node !== null,
    ) as any[];
  }

  // 搜索节点，搜索成功的应展开节点
  filterNode(node: any, searchString: string): any | null {
    const lowerCaseSearch = searchString.toLowerCase();
    const nameMatch = node.name.toLowerCase().includes(lowerCaseSearch);

    if (!node.children) {
      return nameMatch ? node : null;
    }

    const filteredChildren = node.children
      .map((child: any) => this.filterNode(child, searchString))
      .filter((child: null) => child !== null) as any[];

    if (nameMatch || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }

    return null;
  }

  @HostListener('window:resize')
  onResize() {
    this.formFieldRefWidth =
      this.formFieldRef?._elementRef.nativeElement.offsetWidth;
  }

  // 单选事件
  selectSingleNode(node: any) {
    if (this.multiple) return;
    this.selectedValue.set(node[this.key as keyof any] as string);
    this.toggleOverlayStatus(false);
    this.onChange(this.selectedValue()!);
    this.selectionChange.emit(node);
  }

  // 多选事件
  selectMultipleNode(node: any, event: MatCheckboxChange) {
    let currentValues = this.selectedValues();

    const checkNodeValue = node[this.key];
    const isChildNodeSomeSelected = this.hasChildNodeSomeSelected(node);

    let prevIsSelected = currentValues.includes(checkNodeValue);
    if (prevIsSelected && isChildNodeSomeSelected) {
      // 之前选中了，但是有些许字节点选中，改为没选中
      prevIsSelected = false;
      event.source.checked = true; // 强制重置状态
    } else if (prevIsSelected && !isChildNodeSomeSelected) {
      // 之前选中了，没有一个字节点选中，删除选中
      currentValues = currentValues.filter((item) => item !== checkNodeValue);
    } else if (!prevIsSelected && isChildNodeSomeSelected) {
      // 之前没有选中，只有些许字节点选中，则全部选中
      currentValues.push(checkNodeValue);
    } else if (!prevIsSelected && !isChildNodeSomeSelected) {
      // 之前没有选中，所有字节点都未选中，则取消选中
      currentValues.push(checkNodeValue);
    }

    if (node.children) {
      const flattenNodeData = flattenTree(node.children, 'children');

      flattenNodeData.forEach((itemNode: any) => {
        const itemNodeValue = itemNode[this.key];

        const index = currentValues.indexOf(itemNodeValue);
        if (index > -1) {
          currentValues.splice(index, 1);
        }

        if (!prevIsSelected) {
          currentValues.push(itemNodeValue);
        }
      });
    }
    this.selectedValues.set([...currentValues]);
    this.onChange(currentValues);
    this.selectionChange.emit(currentValues);
  }

  hasChild = (_: number, node: any) =>
    !!node.children && node.children.length > 0;

  // 验证节点下的子节点是否有选中又不是全部选中的
  hasChildNodeSomeSelected(node: any): boolean {
    const currentValues = this.selectedValues();
    const key = this.key;
    if (!this.multiple || !node.children?.length) return false;
    const flattenNodeData = flattenTree(node.children, 'children');
    // 判断是否有任何一个选中的
    const hasSelectedChild = flattenNodeData.some((item: any) =>
      currentValues.includes(item[key]),
    );
    // 判断是否所有的子节点都被选中
    const allChildrenSelected = flattenNodeData.every((item: any) =>
      currentValues.includes(item[key]),
    );
    return hasSelectedChild && !allChildrenSelected;
  }

  toggleOverlayStatus(isOpen?: boolean) {
    if (this.disabled || this.readonly) return;

    isOpen = isOpen ?? !this.isOpenOverlay();
    this.isOpenOverlay.set(isOpen);

    if (this.isOpenOverlay()) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement.focus();

        document.addEventListener('click', this.globalClickListener);
      }, 50);
    } else {
      document.removeEventListener('click', this.globalClickListener);
    }
  }

  globalClickListener = (event: Event) => {
    const target = event.target as HTMLElement;
    const overlayNativeElement = this.overlayElement?.nativeElement;

    if (this.overlayElement && overlayNativeElement.contains(target)) {
      return;
    }

    this.toggleOverlayStatus(false);
  };

  //实现 ControlValueAccessor
  onChange = (_: string | Array<any>) => {};
  onTouched = () => {};

  writeValue(value: string | Array<any>): void {
    if (this.multiple) {
      this.selectedValues.set(value as Array<any>);
    } else {
      this.selectedValue.set(value as string);
    }
  }

  registerOnChange(fn: (value: string | Array<any>) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  ngOnInit(): void {
    this.dataSource.data = this.nodes;
  }

  ngAfterViewInit() {
    this.formFieldRefWidth =
      this.formFieldRef?._elementRef.nativeElement.offsetWidth;
  }
}
