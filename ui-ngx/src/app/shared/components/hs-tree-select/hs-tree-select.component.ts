import { OverlayModule } from '@angular/cdk/overlay';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, effect, ElementRef, forwardRef, HostListener, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

@Component({
  selector: 'hs-tree-select',
  templateUrl: './hs-tree-select.component.html',
  styleUrls: ['./hs-tree-select.component.less'],
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, OverlayModule, MatTreeModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    }
  ]
})
export class TreeSelectComponent implements ControlValueAccessor, AfterViewInit  {
  @ViewChild('formFieldRef') formFieldRef: MatFormField;
  @ViewChild('overlayElement') overlayElement: ElementRef; 

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();


  formFieldRefWidth: number;
  
  value = 'Clear me';

  isOpenOverlay = signal(false);

  constructor() {
    this.dataSource.data = TREE_DATA;
  }
  
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;


  toggleOverlayStatus(isOpen?: boolean) {
    isOpen = isOpen ?? !this.isOpenOverlay(); 
    this.isOpenOverlay.set(isOpen);

    if(this.isOpenOverlay()) {
      setTimeout(() => {
        document.addEventListener("click", this.globalClickListener);
      }, 50);
    }else{
      document.removeEventListener("click", this.globalClickListener);
    }
  }

  globalClickListener = (event: Event) => {
    const target = event.target as HTMLElement;
    const overlayNativeElement = this.overlayElement?.nativeElement;

    if (this.overlayElement && overlayNativeElement.contains(target)) {
      return;
    }

    this.toggleOverlayStatus(false);
  }



  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.formFieldRefWidth = this.formFieldRef?._elementRef.nativeElement.offsetWidth;
  }


}