import { LightningElement, api, wire, track} from 'lwc';
import getCurrentCheckOutStep from '@salesforce/apex/B2B_CheckoutPathCntrl.findCheckOutNextStep';
import { refreshApex } from '@salesforce/apex';
import b2bCheckoutLabels from '@salesforce/label/c.B2BCheckoutPathLabels';
import {fireEvent, registerListener, unregisterAllListeners} from 'c/b2b_PubsubService';
import { publish,  MessageContext,subscribe, unsubscribe,APPLICATION_SCOPE } from 'lightning/messageService';
import B2BCheckoutPath from '@salesforce/messageChannel/B2BCheckoutPath__c';
const CHECK_PATH = 'Check_Path';

export default class B2b_CheckoutPath extends LightningElement {
    subscription =null;
    @api channelName = '/event/CartCheckoutSession__e';

    @api recordId;

    @track stepInfo;

    @api steps= [];

  
    @api currentStep = "Start";
    @api type = "base";
    @api variant = "base";

    get isTypeBase() {
        return this.type === "base";
    }
    subscription = null;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                B2BCheckoutPath,
                (message) =>  refreshApex(this.stepInfo),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }


    @wire(getCurrentCheckOutStep, { cartID: "$recordId" }) stepInfo;

    // Handles subscribe button click
    // handleSubscribe() {
    //     // Callback invoked whenever a new event message is received
    //     const thisReference = this;
    //     const messageCallback = function(response) {
    //         console.log('New message received 1: ', JSON.stringify(response));
    //         console.log('New message received 2: ', response);
            
    //         var obj = JSON.parse(JSON.stringify(response));
    //         console.log('New message received 4: ', obj.data.payload.Message__c);
    //         console.log('New message received 5: ', this.channelName);
    //         const evt = new ShowToastEvent({
    //             title: 'Pay Load Received !',
    //             message: obj.data.payload.Message__c,
    //             variant: 'success',
    //         });

    //         thisReference.dispatchEvent(evt);
    //         // Response contains the payload of the new message received
    //     };

    //     // Invoke subscribe method of empApi. Pass reference to messageCallback
    //     subscribe(this.channelName, -1, messageCallback).then(response => {
    //         // Response contains the subscription information on subscribe call
    //         console.log('Subscription request sent to: ', JSON.stringify(response.channel));
    //         this.subscription = response;
    //     });
    // }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    disconnectedCallback() {
        this.unsubscribeEvent();
        //this.unsubscribeToMessageChannel();
    }

    subscribeEvent() {
        registerListener(CHECK_PATH, (message) => {
            console.log('CHECK PATH');
            console.log('refresh checkout path ');
            refreshApex(this.stepInfo);
            console.log('refreshed step--'+this.stepInfo.data);
        }, this);
    }

    unsubscribeEvent() {
        unregisterAllListeners(this);
    }
    connectedCallback() {
        //this.subscribeToMessageChannel();
        this.subscribeEvent();
        var label = {b2bCheckoutLabels}; 
            b2bCheckoutLabels.split(",").forEach(
                cPath => { console.log('Checkout Paths ~ '  + cPath)
                if(cPath != ''){
                    this.steps.push({
                        label : cPath,
                        value : cPath
                    });
                console.log('Checkout steps ~12 '  + JSON.stringify(this.steps))
                //this.options = [...this.options ,{value: result[i] , label: result[i]}];
                }
            }

            );
            
    }

    messageReceived(event) {
        const eventCheckOutSession = event.detail;
        console.log('CheckOut Path States ____ ' + JSON.stringify(eventCheckOutSession));
        console.log('CheckOut Path Next_State__c ____ ' + event.detail.data.payload.Next_State__c);

        if(event.detail.data.payload.Next_State__c != null){
           this.stepInfo =  event.detail.data.payload.Next_State__c;
        }
        
        console.log('CheckOut Path stepInfo ____ ' + this.stepInfo);
    }
}