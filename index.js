import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect } from 'react-redux';
import axios from 'axios';
import SignUpTemplate from '../../templates/signUpTemplate';
import arrowDown from '../../../assets/fonts/arrow-down-light.svg';
import arrowUp from '../../../assets/fonts/arrow-up-light.svg';
import InputField from '../../../components/inputField';
import Button from '../../../components/button';
import Loader from '../../../components/loader';
import StatesLga from '../../../constants/statesLga';
import Banks from '../../../constants/bank';
import {updateFormField } from '../../../redux/actions/formActions';
import {populateUserSignup} from '../../../redux/actions/formActions';
import {uploadFile} from '../../../redux/actions/formActions';
import {toggleBvnVerified } from '../../../redux/actions/userActions';
import handleUpdateField from '../../../utils/handleUpdateField';
import './style.css';




export class BioData extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            showPersonalDropdown : false,
            showBusinessDropdown : false,
            showUploadsDropdown : false,
            showAgentReferral: false,
            showUploadCAC: false,
            selectedStatesLga: 'Select your state',
            selectedStatesLga2: 'Select your state',
            bankTarget: '',
            accountName: '',
            formValues: {},
            uploadsCount: 0,
            uploadMssg:''
        }


        this._handleShowPersonalDropdown = this._handleShowPersonalDropdown.bind(this);
        this._handleShowBusinessDropdown = this._handleShowBusinessDropdown.bind(this);
        this._handleShowUploadsDropdown = this._handleShowUploadsDropdown.bind(this);
        this._handleAgentReferral = this._handleAgentReferral.bind(this);
        this._handleBankSelect = this._handleBankSelect.bind(this);
        this._handleAcctNumber = this._handleAcctNumber.bind(this);
        this._handleSaveData = this._handleSaveData.bind(this);
        this._handleLoadBioData = this._handleLoadBioData.bind(this);
        this._handleReduceImageSize = this._handleReduceImageSize.bind(this);
        this._handleUploadImages = this._handleUploadImages.bind(this);
        this.resizeImage= this.resizeImage.bind(this)
    }

    componentDidMount(){
        this._handleLoadBioData();

        if ( this.props.verifiedBvn === true) {
            document.getElementById('firstname').setAttribute("readonly", true)
            document.getElementById('surname').setAttribute("readonly", true)
            document.getElementById('middlename').setAttribute("readonly", true)

        }
    }

    shouldComponentUpdate(nextProps, nextState){
        
        console.log(this.props.formValues)
        if (this.props.verifiedBvn === true){
            document.getElementById('firstname').setAttribute("readonly", true)
            document.getElementById('surname').setAttribute("readonly", true)
            document.getElementById('middlename').setAttribute("readonly", true);
        }

        return true;
    }

    componentDidUpdate(){
        // const savedUploads= this.props.uploads;
        // let uploads = [];
        // for (var upload in savedUploads) {
        //     if (!savedUploads.hasOwnProperty(upload)) {
        //         continue;
        //     }
        //     uploads.push(upload);
        // }
        // console.log(uploads);
        // if (uploads.length === 4){
        //     this.setState({ uploadsComplete: true})
        // }
    }



    render(){
        console.log(this.state.uploadsCount)
        const{formValues} = this.props;   
        const lgas = StatesLga.filter(statelga => {
                if (formValues.stateResidence){
                    if (statelga.states.toUpperCase() === formValues.stateResidence.toUpperCase())
                    return  statelga;
                }

                else{
                    
                    return statelga.states === 'Select your state'
                }
                 
            })
        const lgas2 = StatesLga.filter(statelga => {
                if (formValues.stateBusiness){
                    return statelga.states.toUpperCase() === formValues.stateBusiness.toUpperCase()
                }

                else{
                    return statelga.states === 'Select your state'
                }
                    
            })

        return(
             
            <SignUpTemplate header='Biodata Form' save = {this._handleSaveData}>
                {/* <Loader/> */}
                <div className= 'biodata-wrap'>
                    <div className='biodata-header-text'>
                        <p className='text1'>
                            <span>Welcome.</span><br/>  
                            Kindly fill the form below to ensure we capture all your details. 
                        </p>
                        <p className='text2'>
                            The following will be required to complete the form,
                            Passport Photograph, Utility Bill (Lawma, PHCN, Water 
                            Cooperation), means of ID (National ID, Voters Card, Driver's 
                            license or International Passport) and BVN, ensure you have 
                                them on-hand before you proceed 
                        </p>
                    </div>
                    <div className='biodata-main'>
                        <div className='biodata-dropdown personal'>
                                Personal Datails
                                <span className='personalDetailsArrow' onClick={this._handleShowPersonalDropdown}>
                                    <img src={this.state.showPersonalDropdown? arrowUp: arrowDown}  alt='>'/>
                                </span>
                        </div>
                            <div className= {`personal-dropdown-wrap ${this.state.showPersonalDropdown? 'showDropdown' : ''}`}>

                                <div className='dropdown-wrap'>
                                    <label>How did you here about us?</label>
                                    <select className='lgaDropdown'  value={formValues.referral} onChange={this._handleAgentReferral} >
                                        <option value="" selected disabled hidden>Select Referral</option>
                                        <option>Referral</option>
                                        <option>Facebook</option>
                                        <option>Instagram</option>
                                        <option>YouTube</option>
                                        <option>Twitter</option>
                                        <option>PayCenter Agent</option>
                                        <option>Other sources</option>
                                    </select>
                                </div>

                                <div className={this.state.showAgentReferral? '': 'hideAgent'}>
                                    <InputField label = 'Agent ID' 
                                                type='text'
                                                onChange={handleUpdateField.bind(this, 'agentReferralId')}
                                                value={formValues.agentReferralId}
                                                display='hide'
                                    />
                                </div>
                               
                                <InputField label = 'Surname'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'surname')}
                                            value={formValues.surname}
                                            id = 'surname' 
                                />
                                <InputField label = 'First Name'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'firstname')}
                                            value={formValues.firstname}
                                            id='firstname' 
                                />
                                <InputField label = 'Middle Name'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'middlename')}
                                            value={formValues.middlename}
                                            id='middlename'
                                />
                                <InputField label = 'Residential Address'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'address')}
                                            value={formValues.address}
                                />
                                <InputField label = 'Date of Birth'
                                            type='date'
                                            onChange={handleUpdateField.bind(this, 'dateOfBirth')}
                                            placeholder = 'Enter date of birth'
                                            value={formValues.dateOfBirth}
                                />
                                <InputField label = 'Nationality'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'nationality')}
                                            value='Nigeria'
                                />
                                <div className='dropdown-wrap'>
                                    <label>State of Residence</label>
                                    <select className='statesDropdown' value={formValues.stateResidence} onChange={handleUpdateField.bind(this, 'stateResidence')}>
                                        {
                                            StatesLga.map((statelga, i) => {
                                                return <option key={i}>{statelga.states}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='dropdown-wrap'>
                                    <label>Local Government Area</label>
                                    <select className='lgaDropdown'  value={formValues.localGovernment} onChange={handleUpdateField.bind(this, 'localGovernment')} >
                                        {
                                           lgas[0].lga.map((lga, i) => {
                                            return <option key={i}>{lga}</option>
                                          })
                                        }
                                    </select>
                                </div>
                           
                    
                                <InputField label = 'Phone Number'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'phoneNumber')}
                                            value={formValues.phoneNumber}
                                />

                                <InputField label = 'Email Address'
                                            type='email'
                                            onChange={handleUpdateField.bind(this, 'email')}
                                            value={formValues.email}
                                />


                                <div className='dropdown-wrap'>
                                    <label>ID Type</label>
                                    <select className='lgaDropdown'  value={formValues.idType} onChange={handleUpdateField.bind(this, 'idType')} >
                                        <option className='defaultColor' value="" selected disabled hidden>Choose here</option>
                                        <option>National ID</option>
                                        <option>Driver's License</option>
                                        <option>International Passport</option>
                                        <option>PVC</option>
                                    </select>
                                </div>

                                <div className='dropdown-wrap'>
                                    <label>Gender</label>
                                    <select className='lgaDropdown'  value={formValues.gender} onChange={handleUpdateField.bind(this, 'gender')} >
                                        <option value="" selected disabled hidden>Select gender</option>
                                        <option>Male</option>
                                        <option>Female</option>

                                    </select>
                                </div>

                            </div>


                        <div className='biodata-dropdown business'>
                                Business Details
                                <span className='businessArrow' onClick={this._handleShowBusinessDropdown}>
                                    <img src={this.state.showBusinessDropdown? arrowUp: arrowDown} alt='>'/>
                                </span>
                        </div>
                            <div className={`business-dropdown-wrap ${this.state.showBusinessDropdown? 'showDropdown' : ''}`}>
                                 
                                <InputField label = 'Business Name'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'businessName')}
                                            value={formValues.businessName} 
                                />
                                <InputField label = 'Business Address'
                                            type='text'
                                            onChange={handleUpdateField.bind(this, 'businessAddress')}
                                            value={formValues.businessAddress} 
                                />

                                <div className='dropdown-wrap'>
                                    <label>State of Residence</label>
                                    <select className='statesDropdown' value={formValues.stateBusiness} onChange={handleUpdateField.bind(this, 'stateBusiness')}>
                                        {
                                            StatesLga.map((statelga, i) => {
                                                return <option key={i}>{statelga.states}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='dropdown-wrap'>
                                    <label>Local Government Area</label>
                                    <select className='lgaDropdown'  value={formValues.localGovernmentBusiness} onChange={handleUpdateField.bind(this, 'localGovernmentBusiness')} >
                                        {
                                            lgas2[0].lga.map((lga, i) => {
                                            return <option key={i}>{lga}</option>
                                          }) 
                                        }
                                    </select>
                                </div>

                                <div className='dropdown-wrap'>
                                    <label>Type of Business</label>
                                    <select className='lgaDropdown'  value={formValues.businessType} onChange={handleUpdateField.bind(this, 'businessType')} >
                                        <option value="Select business type" selected disabled hidden>Select type of business</option>
                                        <option>Sole Proprietorship</option>
                                        <option>Limited company</option>

                                    </select>
                                </div>

                                <div className='dropdown-wrap'>
                                    <label>Bank Name</label>
                                    <select className='lgaDropdown'  value={formValues.bankName} onChange={this._handleBankSelect} >
                                        <option value="" selected disabled hidden>Select bank</option>
                                            {Banks.map(bank => {
                                                return (
                                                    <option data-id={bank.bankCode}
                                                            key={bank.bankCode}
                                                    >
                                                        {bank.name}
                                                    </option>
                                                );
                                            })}

                                    </select>
                                </div>

                                <InputField label =  'Account Number'
                                            type='number'
                                            id='accountNumber'
                                            value={formValues.acctNumber}
                                            onChange={this._handleAcctNumber}
                                        
                                />

                                <InputField label =  'Account Name'
                                            type='text'
                                            value={this.state.accountName}
                            
                                />
                        
                            </div>
                        <div className='biodata-dropdown uploads'>
                                Uploads
                                <span className='uploadsArrow' onClick={this._handleShowUploadsDropdown}>
                                    <img src={this.state.showUploadsDropdown? arrowUp: arrowDown} alt='>'/>
                                </span>
                        </div>
        
                            <div className={`uploads-dropdown-wrap ${this.state.showUploadsDropdown? 'showDropdown' : ''}`}>
                                <div className='uploads-info'>
                                    You can take pictures of the required items with your 
                                    phone, please ensure that your pictures are properly
                                    taken, clear and accurate.
                                    If you select your company type as a <span>Limited Liability</span>
                                    therefore you’re required to upload a snapshot of your
                                    <span>Certificate of Incorporation (CAC)</span>  
                                </div>

                                <form id='foo' method="post">
                                <div className='upload-wrap'>
                                    <label>Upload Passport</label>
                                    <input type='file' name='files' className='upload'  />
                                </div>

                                <div className='upload-wrap'>
                                    <label>Upload ID</label>
                                    <input type='file' name='files' className='upload' />
                                </div>

                                <div className='upload-wrap'>
                                    <label>Upload Utility Bill</label>
                                    <input type='file' name='files' className='upload'  />
                                </div>

                                <div className='upload-wrap'>
                                    <label>Upload Signature</label>
                                    <input type='file' name='files' className='upload'  />
                                </div>

                                {/* <div className={`upload-wrap ${formValues.businessType === 'Limited company'? '': 'hideUploadCAC'}`}>
                                    <label>Upload CAC</label>
                                    <input type='file' name='files' />
                                </div> */}
                                {
                                    this.state.loading ? 
                                    <Button id='upload' text='Upload all' onClick={this._handleUploadImages}/>:  this.state.uploadsCount === 4  ?
                                    <Button id='uploadComplete' text='Upload all' onClick={this._handleUploadImages}/> :
                                    <Button id='upload' text='Upload all' onClick={this._handleUploadImages}/>
                                }
                                { 
                                this.state.loading ? <Loader type="TailSpin"
                                                            height={20}
                                                            width={20}/>: <span className={this.state.uploadMssg === 'files uploaded!'? 'uploadSuccess': 'uploadFailue'}>{this.state.uploadMssg}</span>
                                }
                                <button type= 'submit' onClick = {this._handleReduceImageSize}>Submit</button>
                               </form>
                                
                            </div>
                    </div>

                    <div className='biodata-agreement'>
                        <p>
                            * I hereby certify that the information provided in
                        this form is true and accurate. I agree that
                        appropriate measures including legal actions could
                        be taken against me if the information that I have
                            provided here is discovered to be false*
                        </p>
                        
                        <Button id='proceed' text='Proceed' onClick={this._handleSaveData} />
                        
                    </div>
                </div>

            </SignUpTemplate>
            
        )
    }

    _handleReduceImageSize(e){
        e.preventDefault()
        const foo = document.getElementById('foo');
        const formData = new FormData(foo);
         console.log(formData);

         for (var p of formData) {
            console.log(p);
          }
        //   let url = 'http://192.168.1.132:8111/files/upload';
        console.log(btoa('+2347051931260' + ":" + '524165'))
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa('+2347051931260' + ":" + '524165'));

          fetch( 'http://192.168.1.132:8111/files/upload', {
            method: 'POST',
            headers: headers,
            body: formData
          })
            .then( res => {
                console.log(res);
                this.setState({loading : false, uploadMssg: 'files uploaded!' });
    
            })
            .catch( err => {
                console.log(err);
                this.setState({loading : false, uploadMssg: 'upload error' });
    
            })


        // const that = this;
        // const name = e.target.name;

        // console.log(e.target.files);
        // let file = e.target.files[0];

        // let url = 'http://192.168.1.132:8111/files/upload';

        // let formData = new FormData();
        // formData.append('file', file )

     

        // fetch('http://192.168.1.132:8111/files/upload', {
        // method: 'POST',
        // body: formData
        // })
        // .then( res => {
        //     console.log(res)
        // })
        // .catch( err=>{
        //     console.log(err)
        // })

    //     axios.post( 'http://192.168.1.132:8111/files/upload',
    //     formData,
    //     {
    //       headers: {
    //           'Content-Type': 'multipart/form-data'
    //       }
    //     }
    //   ).then(function(){
    //     console.log('SUCCESS!!');
    //   })
    //   .catch(function(){
    //     console.log('FAILURE!!');
    //   });
        
        
        // axios({
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     method: 'post',
        //     url: url,
        //     data: formData,
        //     auth: {
        //         username: '+2347051931260',
        //         password: '524165'
        //     }
         
        // })
        // .then( res => {
        //     console.log(res);
        //     this.setState({loading : false, uploadMssg: 'files uploaded!' });

        // })
        // .catch( err => {
        //     console.log(err);
        //     this.setState({loading : false, uploadMssg: 'upload error' });

        // })
        // this.resizeImage({file: e.target.files[0], maxSize: 500})
        // .then(function (resizedImage) {
        //     console.log("upload resized image", resizedImage);
        //     that.props.uploadFile(name, resizedImage);
        //     that.setState({ uploadsCount: that.state.uploadsCount + 1 })
        // }).catch(function (err) {
        //     console.error(err);
        // });
    }

    resizeImage(settings){
        var file = settings.file;
        var maxSize = settings.maxSize;
        var reader = new FileReader();
        var image = new Image();
        var canvas = document.createElement('canvas');
        var dataURItoBlob = function (dataURI) {
            var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                atob(dataURI.split(',')[1]) :
                unescape(dataURI.split(',')[1]);
            var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var max = bytes.length;
            var ia = new Uint8Array(max);
            for (var i = 0; i < max; i++)
                ia[i] = bytes.charCodeAt(i);
            return new Blob([ia], { type: mime });
        };
        var resize = function () {
            var width = image.width;
            console.log(width)
            var height = image.height;
            console.log(height)
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            var dataUrl = canvas.toDataURL('image/jpeg');
            return dataURItoBlob(dataUrl);
        };
        return new Promise(function (ok, no) {
            if (!file.type.match(/image.*/)) {
                no(new Error("Not an image"));
                return;
            }
            reader.onload = function (readerEvent) {
                image.onload = function () { return ok(resize()); };
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
};

    _handleUploadImages(){
        this.setState({loading : true})
        console.log(this.props.uploads)
        let form = new FormData();
        let uploads = Object.entries(this.props.uploads);
         console.log(uploads);
        for (const [name, file] of uploads) {
            form.append(name, file);
            console.log(form)
        }
        console.log(form)
        for (var p of form) {
            console.log(p);
          }
        // var form = new FormData();
        // form.append( this.props.formValues.passportUpload.type, this.props.formValues.passportUpload)
        let url = 'http://192.168.1.132:8111/files/upload';
        
        
        axios({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            method: 'post',
            url: url,
            data: form,
            auth: {
                username: '+2347051931260',
                password: '524165'
            }
         
        })
        .then( res => {
            console.log(res);
            this.setState({loading : false, uploadMssg: 'files uploaded!' });

        })
        .catch( err => {
            console.log(err);
            this.setState({loading : false, uploadMssg: 'upload error' });

        })
    }
    

    _handleLoadBioData(){
        let url = 'http://192.168.1.132:8111/api/get/Agent';

        axios({
            headers: {
                'crossDomain': true,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            method: 'get',
            url: url,
            auth: {
                username: '+2347051931260',
                password: '836295'
            }
         
        })
        .then( res => {
            console.log(res);
            let biodata = res.data;
            this.props.populateUserSignup(biodata);
            if (biodata.bvnNumber !== null || biodata.bvnNumber !== ""){
                this.props.toggleBvnVerified(true)
            }
            console.log(this.props.formValues)
            this.setState({ formValues: this.props.userData,
                            accountName: this.props.formValues.accountName})


        })
        .catch( err => {
            console.log(err);

        })

    }


    _handleSaveData(){
        this.setState({loading: true})
        const{address,agentReferralId, dateOfBirth, email, firstname, 
              gender, idType, localGovernment,middlename,
              phoneNumber, referral, stateResidence, surname,
                businessName, businessAddress, stateBusiness,
            localGovernmentBusiness, businessType, bankName,
            acctNumber, accountName} = this.props.formValues;

   
        // let phone = '07051931260';

        // phone= phone.substring(1);
        let url = 'http://192.168.1.132:8111/api/update/agent';
        
        let data = JSON.stringify({ 
                                    agentIdentificationNumber: agentReferralId,
                                    surname: surname,
                                    firstname: firstname,
                                    middlename: middlename,
                                    dateOfBirth: dateOfBirth,
                                    address: address,
                                    nationality: 'Nigeria',
                                    stateOfResidence: stateResidence,
                                    localGovernment: localGovernment,
                                    phonenumber: phoneNumber,
                                    email: email,
                                    idType: idType,
                                    gender: gender,
                                    businessName: businessName,
                                    businessLocation: businessAddress,
                                    businessState: stateBusiness,
                                    businessLGA: localGovernmentBusiness,
                                    businessType: businessType,
                                    bankName: bankName,
                                    accountNumber: acctNumber,
                                    accountName: this.state.accountName,
                                    howDidYouKnowAboutUs: referral
                                })

                                console.log(data);

        
        axios({
            headers: {
                'crossDomain': true,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            method: 'post',
            url: url,
            data: data,
            auth: {
                username: '+2347051931260',
                password: '836295'
            }
         
        })
        .then( res => {
            // let status = res.data.status;
            // if(status === '00'){
            //     this.props.history.push('/signup/biodata')
            // }
            console.log(res);
            this.props.history.push('./devicePayment')
            this.setState({loading: false})
        })
        .catch( err => {
            console.log(err);

        })
    }

    


    _handleShowPersonalDropdown (){
        this.setState({
            showPersonalDropdown: !this.state.showPersonalDropdown
        })
    }

    _handleShowBusinessDropdown (){
        this.setState({
            showBusinessDropdown: !this.state.showBusinessDropdown
        })
    }
    _handleShowUploadsDropdown (){
        this.setState({
            showUploadsDropdown: !this.state.showUploadsDropdown
        })
    }

    _handleAgentReferral(e) {
        if (e.target.value === 'PayCenter Agent') {
            handleUpdateField( 'referral', e, this);
            this.setState({showAgentReferral: true});
        } 
        else {
            handleUpdateField( 'referral', e, this);
          this.setState({ showAgentReferral: false});
          
        }
    }

    _handleBankSelect(e){
        this.setState({bankTarget: e.target.value});
        handleUpdateField( 'bankName', e, this);
        
    }

    _handleAcctNumber(e) {
        let that = this;
        handleUpdateField( 'acctNumber', e, this);
        const acctNumber = e.target.value;
        if (acctNumber.length < 10){ return ;}
        const bankNameSelect = this.state.bankTarget;
  
        if (bankNameSelect == null) return;
        const bank = Banks.filter(obj => {
          return obj.name == bankNameSelect;
        });
        
        const key = bank[0].bankCode;
        if (acctNumber.length == 10) {
          axios.get(
            `https://cors-anywhere.herokuapp.com/http://178.62.33.6:9171/account/verify?account=${
              acctNumber
            }&bankCode=${key}`,
            {}
          )
            .then(res => {
                console.log('my account name!!')
                console.log(res.data.accountName);
                // handleUpdateField( 'accountName', e, that);
                this.setState({ accountName: res.data.accountName });
            })
            .catch(err => console.log(err));
        }
      }
}

const mapStateToProps = state => {
    console.log(state)
    return {
        formValues: state.form.values,
        verifiedBvn: state.user.verifiedBvn,
        uploads: state.form.uploads
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFormField:(name, value)=>dispatch(updateFormField(name, value)),
        populateUserSignup:(data)=> dispatch(populateUserSignup(data)),
        toggleBvnVerified:(value) => dispatch(toggleBvnVerified(value)),
        uploadFile:(name, file)=> dispatch(uploadFile(name, file))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BioData);
