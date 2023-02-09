import { LightningElement,wire } from 'lwc';
import {fireEvent} from 'c/b2b_PubsubService';
const IS_REFRESH = 'Refresh-Ordersummary';
const CHECK_PATH = 'Check_Path';
import { publish,  MessageContext,subscribe, unsubscribe,APPLICATION_SCOPE } from 'lightning/messageService';
import B2BCheckoutPath from '@salesforce/messageChannel/B2BCheckoutPath__c';

export default class B2b_RefreshCheckout extends LightningElement {

    @wire(MessageContext)
    messageContext;
    publishEvent() {
        const message = {
            isRefresh: true,
        };
        fireEvent(IS_REFRESH, message);
        fireEvent(CHECK_PATH, message);
    }
    connectedCallback(){
        console.log('refresh checkout steps');
        this.publishEvent();
        this.refreshCheckoutPath();
    }
    refreshCheckoutPath(){
        console.log('refresh checkout lms');
        const payload = { refresh: true };
        publish(this.messageContext, B2BCheckoutPath, payload);

    }
}