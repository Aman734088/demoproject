import { LightningElement,track ,api} from 'lwc';

import registerUser from '@salesforce/apex/CommunityAuthController.registerUser';
import isEmailExist from '@salesforce/apex/CommunityAuthController.isEmailExist';
import psetAssign from '@salesforce/apex/CommunityAuthController.psetAssign';
export default class B2B_Register_Component extends LightningElement {

    @track firstName = ''; 
    @track lastName = '';
    @track email = null;
    @track username = null;
    @track password = null;
    @track confirmPassword='';
    @track accountName = null;
    @track psetGroupId = '0PG74000000Kz6qGAC';
    @track newUID;
    @track loginUrl;
    @track Phone;
    @track errorCheck;
    @api showModal = false; 
    @track defaultErrorMsg;
    @track emailError;
    @track errorMessage;
    @track passwordTooltip='tooltiptext tooltipHide';
    @track passwordTooltiperror = 'tooltiptext tooltipHide';
    @track showTermsAndConditions=false;
    @track userName = '';
    @track userCreated = false;
    @track pageLoading = true;
    @track tooltip_style ='tooltiptext';
    @track tooltip_styleShow = 'tooltiptext tooltipShow';
    @track tooltip_styleHide = 'tooltiptext tooltipHide';
    @track tooltip_field = 'tooltiptext tooltipHide';
    @track showToast = false;
    @track toastTitle ="This Field is Required";
    @track toastMessage = "Please enter the correct/Required Value";
    connectedCallback()
    {
        this.pageLoading = false;
        this.defaultErrorMsg = "Something Went Wrong, Please Try Again after sometimes";
        this.errorCheck = true;
  
    }

    handleFirstNameChange(event)
    {
        this.firstName = event.target.value;
         this.accountName = this.firstName + this.lastName + ' UserAccount';       
        if(this.lastName == '' && this.firstName == '')
        {
            this.accountName = null;
        }
    }
    handleLastNameChange(event)
    {
        this.lastName = event.target.value;
        this.accountName = this.firstName + this.lastName + ' UserAccount';
        if(this.lastName == '' && this.firstName == '')
        {
            this.accountName = null;
        }
    }

    handleEmailChange(event)
    {
        this.email = event.target.value;
        this.userName = event.target.value ;
    }
    onEmailInvalid(event)
    {

        if (!event.target.validity.valid) 
        {
            event.target.setCustomValidity('Enter a valid email address')
        }
    }
    onEmailInput(event)
    {

        event.target.setCustomValidity('')
    }
    handlePhone(event)
    {
        this.Phone=event.target.value;
    }

    handlePasswordChange(event){

        this.password = event.target.value;
    }

    handleConfirmPasswordChange(event){

        this.confirmPassword = event.target.value;
    } 

    handleRegister(event)
    {
                            this.errorCheck = false;
                            this.errorMessage = null;
                            this.tooltip_field = 'tooltiptext tooltipHide';
                            this.tooltip_field = 'tooltiptext tooltipHide';

                            if(!this.firstName || this.firstName == ''){

                                this.tooltip_field = 'tooltiptext tooltipShow';

                            } else {

                                this.tooltip_field = 'tooltiptext tooltipHide';
                            }

                            if(!this.lastName || this.lastName == ''){

                                this.tooltip_field = 'tooltiptext tooltipShow';
                        
                            } else {
                                
                                this.tooltip_field = 'tooltiptext tooltipHide';
                            }

                            if(!this.email){

                                this.tooltip_field = 'tooltiptext tooltipShow';
                                

                            } else {
                                
                                this.tooltip_field = 'tooltiptext tooltipHide';
                                
                            }

                            if(!this.password){

                                this.tooltip_field = 'tooltiptext tooltipShow';
                                this.tooltip_field = "tooltiptext tooltipHide";
                                

                            } else {
                                
                                this.tooltip_field = 'tooltiptext tooltipHide';
                               
                            }

                            if(!this.confirmPassword){

                                this.tooltip_field = 'tooltiptext tooltipShow';
                                

                            } else {
                                
                                this.tooltip_field = 'tooltiptext tooltipHide';
                               
                            }
                            console.log('Inside the handleReg')
                            this.pageLoading = true;
                            this.errorCheck = false;
                            this.errorMessage = null;
                            this.showToast = false;

                            if(this.firstName && this.lastName && this.email && this.userName && this.password && this.confirmPassword)
                            {

                                this.pageLoading = true;
                    
                                if(this.password != this.confirmPassword){
                    
                                    this.tooltip_field = "tooltiptext tooltipHide";
                                    this.passwordError = 'Password did not match. Please Make sure both the passwords match.';
                                    this.passwordTooltiperror = 'tooltiptext tooltipShow tooltipError';
                    
                                    event.preventDefault();
                    
                                    this.pageLoading = false;
                                    
                                    return;
                                }
                            }
                            this.pageLoading=true;
                            let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);
                            this.pageLoading =false;
                            if( emailCheck == null || emailCheck == undefined || emailCheck == false )
                            {
                                this.emailError= 'Please enter a valid email Address!'
                                return;
                            }
                            this.pageLoading = true;
                            let passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.password);

                            if(passwordCheck == null || passwordCheck == undefined || passwordCheck == false){

                                this.pageLoading = false;
                                this.passwordError = 'Password must have Minimum eight characters,and should contaim one letter, one number and one special character.';
                                this.passwordTooltiperror = 'tooltiptext tooltipShow tooltipError'; 
                                return;
                            } 
                            if( this.accountName == null)
                            {
                                this.errorCheck = true;
                                this.errorMessage = 'account assignment error';
                                this.pageLoading = false;
                                return;
                            }
                            event.preventDefault();
                            isEmailExist({Email: this.email,Phone:this.Phone})
                            .then((result) =>{
                                if(result != null && result != undefined && result == true)
                                {
                                    this.errorCheck = true;
                                    this.errorMessage = 'Email or phone already exist';
                                    this.emailError = 'username already exists.';
                                    this.pageLoading = false;
                                }
                                else {
                                    registerUser({ firstName: this.firstName, lastName: this.lastName, email: this.email, accountName : this.accountName, pass:this.password,phone:this.Phone})
                                        .then((result1) => 
                                        {
                                                        
                                            if(result1){    
                                                this.newUID = result1[1];
                                                this.loginUrl = result1[3];
                                                this.userCreated  =true;
                                                this.assignPermissionSet();
                                            
                                            }
                                            this.pageLoading = false;
                                        })
                                        .catch((error) => {
                                            this.pageLoading = false;                            
                                            if(error && error.body && error.body.message){
                            
                                                this.errorCheck = true;
                                                this.errorMessage = error.body.message;
                                            }              
                                        });
                                    }
                            })
                            .catch((error) => {
                                this.error = error;
                                if(error && error.body && error.body.message){
                                    this.errorCheck = true;
                                    this.errorMessage = error.body.message;
                                }
                                this.pageLoading = false;  
                            });
    }
    assignPermissionSet()
    {
        this.pageLoading = true;
        psetAssign({permissionsetGroupsID:this.psetGroupId ,userId:this.newUID})
        .then((result2) =>
        {
            window.location.href = this.loginUrl;
        })
        .catch((error) =>
        {

            this.error = error;
            this.pageLoading =false;
            console.log(error);
        });
    }  
}