import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: any[] = [];
    showStandard(meg:string) {
		this.show(meg);
	}

	showSuccess(meg:string) {
		this.show(meg, { classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(meg:string) {
		this.show(meg, { classname: 'bg-danger text-light', delay: 12000 });
	}

	show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
		this.toasts.push({ textOrTpl, ...options });
	}

	remove(toast:any) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
