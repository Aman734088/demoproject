import { LightningElement,wire,track ,api } from 'lwc';
import getBillAddress from '@salesforce/apex/B2B_MyAddressSelectorFlowController.getBillToAddress';
import getBuyerInfo from '@salesforce/apex/B2B_MyAddressSelectorFlowController.getBuyerInfo';
import updateBillToAddress from '@salesforce/apex/B2B_MyAddressSelectorFlowController.updateBillToAddress';
//import createShippingAddress from '@salesforce/apex/B2BAddressController.createShippingAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class B2b_myBillToAddressOnCheckout extends LightningElement {

    @api cartId;
    user=[];
    conName='';
    accountName='';
    addressVal=false;
    @track choosedAddress='';
    @track choosedlabel='';
    show=true;
    save=false;
    billToOption=[];
    billToAddress=[];
    @track mapData= [];
    @track value ='';
    isShowModal=false;
    name='';
    street='';
    city='';
    state='';
    country='';
    postalcode='';


    @wire( getBillAddress ) 
    addresses({ error, data }) { 
 
        if ( data ) { 
            
            this.billToAddress = data;
            const updatedCartItems = (this.billToAddress || []).map((item) => {
                // Make a copy of the cart item so that we can mutate it
                //let updatedItem = { ...item };
                
                if(item.IsDefault===true)
                {
                  this.value=item.Id
                }
                //this.billToOption.push({label:item.Street+', '+item.City+', '+item.State+', '+item.Country, value:item.Id});
                this.billToOption = [...this.billToOption ,{label:item.Street+', '+item.City+', '+item.State+', '+item.Country, value:item.Id}];
            });
 
        } else if ( error )
        {
          console.log( 'Error is ' + JSON.stringify( error ) );
        }
    }
    get choosedlabel()
    {
      return this.choosedlabel;
    }
    @wire( getBuyerInfo ) 
    user({ error, data }) { 
 
        if ( data ) { 
            
            this.user=data;
            this.accountName=this.user.Account.Name;
        } else if ( error )
            console.log( 'Error is ' + JSON.stringify( error ) );
         
    }  
    showDetails()
    {
      this.choosedAddress = this.billToOption.find(option => option.value === this.value);
      this.choosedlabel=this.choosedAddress.label;
        
        if(this.addressVal===false){
            this.addressVal=true;
        }
        else{
            this.addressVal=false;
        }        
    }  
    get options() {
        return this.billToOption;
    }
    handleChange(event)
    {
        this.value = event.detail.value;
        console.log('Option selected with value: ' + this.value);
        this.choosedAddress = this.billToOption.find(option => option.value === this.value);
        this.choosedlabel=this.choosedAddress.label;
        updateBillToAddress({cartId:this.cartId,contactPointAddressId:this.value})
        .then((result)=>{
            console.log(result);
        });        
    }
    showModalBox()
    {
        this.isShowModal=true;
    }
    hideModalBox() {  
          this.isShowModal=false;
      }
      handleName(event)
      {
        this.name=event.target.value;
      }
      handleStreet(event)
      {
        this.street=event.target.value;
      }
      handleCity(event)
      {
        this.city=event.target.value;
      }
      handleState(event)
      {
        this.state=event.target.value;
      }
      handleCountry(event)
      {
        this.country=event.target.value;
      }
      handlepostalCode(event)
      {
        this.postalcode=event.target.value;
      }
      handleCheckboxChange(event)
      {
        console.log(this.save)
        if(this.save===false)
        {
          this.save=true;
        }
        else{
          this.save=false;
        }
      }
      handleSave(event)
      {
       
          this.isShowModal = false;
          // createShippingAddress({name:this.name,street:this.street,city:this.city,
          //   state:this.state,country:this.country,postalCode:this.postalcode})
          // .then((result)=>{
            
          //   this.dispatchEvent(
          //     new ShowToastEvent({
          //         title: 'Success',
          //         message: 'New address has been created.',
          //         variant: 'success',
          //         mode: 'dismissable'
          //     })
          // );
          // })
          // .catch((error)=>{
          //   console.log(error);
          // });   
      }
}