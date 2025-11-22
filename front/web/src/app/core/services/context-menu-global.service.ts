import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ContextMenuGlobalState {
  visible: boolean;
  x: number;
  y: number;
  extraClass?: string;
  items: { label: string; action: () => void }[];
}

@Injectable({
  providedIn: 'root',
})
export class ContextMenuGlobalService {
  private stateSubject = new BehaviorSubject<ContextMenuGlobalState>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
    extraClass: '',
  });

  state$ = this.stateSubject.asObservable();

  open(
    x: number,
    y: number,
    items: ContextMenuGlobalState['items'],
    extraClass?: string
  ) {
    this.stateSubject.next({
      visible: true,
      x,
      y,
      items,
      extraClass,
    });
  }

  close() {
    this.stateSubject.next({
      visible: false,
      x: 0,
      y: 0,
      items: [],
    });
  }
}
