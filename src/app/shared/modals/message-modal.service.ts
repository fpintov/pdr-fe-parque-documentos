import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface MessageModalData {
  message: string;
  type: 'success' | 'error';
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageModalService {
  private showModalSubject = new Subject<MessageModalData | null>();
  showModal$ = this.showModalSubject.asObservable();

  showSuccess(message: string, title?: string): void {
    this.showModalSubject.next({ message, type: 'success', title });
  }

  showError(message: string, title?: string): void {
    this.showModalSubject.next({ message, type: 'error', title });
  }

  hide(): void {
    this.showModalSubject.next(null);
  }
}

