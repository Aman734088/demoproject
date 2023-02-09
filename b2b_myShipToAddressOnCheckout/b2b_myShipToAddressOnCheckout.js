import { LightningElement,wire,track ,api } from 'lwc';
import getShipToAddress from '@salesforce/apex/B2B_MyAddressSelectorFlowController.getShipToAddress';
import getBuyerInfo from '@salesforce/apex/B2B_MyAddressSelectorFlowController.getBuyerInfo';
import createShipToAddress from '@salesforce/apex/B2B_MyAddressSelectorFlowController.createShipToAddress';
import updateShipToAddress from '@salesforce/apex/B2B_MyAddressSelectorFlowController.updateShipToAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateShipToAddressWithoutContactPointAddress from '@salesforce/apex/B2B_MyAddressSelectorFlowController.updateShipToAddressWithoutContactPointAddress';
import refreshApex from '@salesforce/apex';

export default class B2b_myShipToAddressOnCheckout extends LightningElement {
    @api cartId;
    user=[];
    accountName='';
    addressVal=false;
    @track choosedAddress='';
    @track choosedlabel='';
    show=true;
    save=false;
    shipToOption=[];
    getshipToAddress=[];
    @track mapData= [];
    @track value ='';
    isShowModal=false; 
    name='';
    street='';
    city='';
    state='';
    country='';
    postalcode='';


    @wire( getShipToAddress ) 
    addresses({ error, data }) { 
 
        if ( data ) {  
            this.getshipToAddress = data;
            console.log(this.getshipToAddress)
            const updatedCartItems = (this.getshipToAddress || []).map((item) => {
                // Make a copy of the cart item so that we can mutate it
                //let updatedItem = { ...item };
                
                if(item.IsDefault===true)
                {
                  this.value=item.Id 
                }
                //this.shipToOption.push({label:item.Street+', '+item.City+', '+item.State+', '+item.Country, value:item.Id});
                this.shipToOption = [...this.shipToOption ,{label:item.Street+', '+item.City+', '+item.State+', '+item.Country, value:item.Id}];
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
    
  
    get options() {
        return this.shipToOption;
    }
    handleChange(event)
    {
        this.value = event.detail.value;
        console.log('Option selected with value: ' + this.value);
        this.choosedAddress = this.shipToOption.find(option => option.value === this.value);
        this.choosedlabel=this.choosedAddress.label;
        updateShipToAddress({cartId:this.cartId,contactPointAddressId:this.value})

        .then((result)=>{

            console.log(result);

        });
        
    }
    connectedCallback()
    {
    //   refreshApex(this.getshipToAddress);
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
          if(this.save===true){
          
          createShipToAddress({name:this.name,street:this.street,city:this.city,
            state:this.state,country:this.country,postalCode:this.postalcode})
          .then((result)=>{
            this.shipToOption.push({label:this.street+', '+this.city+', '+this.state+', '+this.country, value:result.Id});
            this.value=result;
//             updateShipToAddress({cartId:this.cartId,contactPointAddressId:this.value})
//         .then((result)=>{
//               console.log(result);
//   });
            console.log(this.value);
            this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Success',
                  message: 'New address has been created.',
                  variant: 'success',
                  mode: 'dismissable'
              })
          );
          console.log('Debug1');
        //  window.location.href = window.location.href;
          })
          .catch((error)=>{
            console.log(error);
          });  
        }
        else{

          console.log('Checkbox is not selected');  
          this.isShowModal = false;  
          updateShipToAddressWithoutContactPointAddress({cartId:this.cartId,name:this.name,street:this.street,city:this.city, 
              state:this.state,country:this.country,postalCode:this.postalcode})  
            .then((result)=>{
              console.log(result); 
              this.dispatchEvent( 
                new ShowToastEvent({ 
                    title: 'Success', 
                    message: 'New address has been created.', 
                    variant: 'success', 
                    mode: 'dismissable' 
                }) 
            ); 
            console.log('Debug1');
  
          //  window.location.href = window.location.href; 
            }) 
            .catch((error)=>{  
              console.log(error);  
            });  
  
        } 
      }
   
    
}
