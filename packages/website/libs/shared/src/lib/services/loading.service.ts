import { Injectable } from '@angular/core';

declare var $;

@Injectable()
export class LoadingService {

  constructor() { }

  showLoading() {

    $('.overlay-loading').fadeIn().css('display', 'table');

  }

  hideLoading() {

    $('.overlay-loading').fadeOut();

  }

}
