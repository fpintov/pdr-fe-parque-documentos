import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageModalService } from './message-modal.service';

export type MessageType = 'success' | 'error';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  message = '';
  title = '';
  type: MessageType = 'success';
  private destroy$ = new Subject<void>();

  constructor(private messageModalService: MessageModalService) {}

  ngOnInit(): void {
    this.messageModalService.showModal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.message = data.message;
          this.type = data.type;
          this.title = data.title || this.getDefaultTitle();
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this.isVisible = false;
    this.messageModalService.hide();
  }

  get buttonClass(): string {
    return this.type === 'error' ? 'error-button' : 'success-button';
  }

  get headerClass(): string {
    return this.type === 'error' ? 'modal-header-error' : 'modal-header-success';
  }

  getDefaultTitle(): string {
    return this.type === 'error' ? 'Error al crear la serie' : 'Serie creada exitosamente';
  }
}

