import { Injectable } from '@angular/core';

@Injectable()
export class PaymentService {

  //Stripe publishable key
  stripe = Stripe('pk_test_5KcQuLr9acsZqO3oGuj9mqz6');

  constructor() { }

}
