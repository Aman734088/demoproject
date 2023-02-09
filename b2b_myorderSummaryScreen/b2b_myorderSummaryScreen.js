import { LightningElement, api, wire, track } from 'lwc';
import getCartDetails from '@salesforce/apex/B2b_MyOrderSummaryInformation.myCartItems';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import {fireEvent, registerListener, unregisterAllListeners} from 'c/b2b_PubsubService';
import { publish,  MessageContext,subscribe, unsubscribe,APPLICATION_SCOPE } from 'lightning/messageService';
const IS_REFRESH = 'Refresh-Ordersummary';
const CHECK_PATH = 'Check_Path';
export default class B2b_myorderSummaryScreen extends LightningElement {
    @api
    recordId;
    @track 
    cartInfo;
    @wire(getCartDetails, { cartID: "$recordId" }) cartInfo;
    
    openUrl(url){
        this.navigateToWebPage(url);
    }

    openProductDetail(e) {
        let productId = e.currentTarget.dataset.id;
        let url = window.location.href.split('/s/');
        let newUrl = url[0] + '/s/product/' + productId;
        this.openUrl(newUrl);
    }
    // Navigation to web page 
    navigateToWebPage(url) {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": url
            }
        });
    }
}
