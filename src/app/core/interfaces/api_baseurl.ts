export var config = {
  auth: {
    login: 'login',
    verify: 'verifyotp',
    logout: 'api/logout',
    forgetPassword: {
      forgetEmail: 'forget',
      verifyLink: 'cheklinkstatus',
      changePassword: 'forgot/changePassword',
      resetPassword: 'forgot/resetPassword',
      verifyOtp: '/forgot/verifyOtp'
    },

    signup: {
      signup: 'signup',
      resend: 'resend_otp',
      verify: 'verify_otp'
    },
    getuser: 'api/get_userlist',
    getpermission: 'api/allpermissionlist',
    havepermission: 'api/have_permission',
    Addpermission: 'api/user_revokepermission',
    role_permission: 'api/role_permission',
    add_role: 'api/role_revokepermission',
    getrole: 'api/getrolelist',
    getpermissionrole: 'api/allpermissionlistbyrole'
  },

  // dashboard: {
  //   dashboard_api: '/api/dashboard',
  //   pie_chart: '/api/piechart',
  //   bar_graph: '/api/graphchart',
  // },

  kyc: {
    kycDetails: 'kyc/verify-data', kycStep: 'kyc/kyc-step'
  },



  header: {
    getbalance: 'api/getbalance',
  },


  sidemenu_live_sandbox: {
    live: '/api/sidemenu_live_sandbox',
    createva: 'api/createVa'
  },

  apikey: {
    key: '/api/getapikeyslist',
  },

  fileUpload: {
    upload: '/api/uploadfileaws',
  },

  UserKyc: {
    contactDetail: { url: 'contact-details' },
    gstnDetail: { url: 'kyc/get-gstn' },
    udyamDetail: { url: 'kyc/get-udyam-details' },
    shopStateList: { url: 'kyc/state-list' },
    getShopDetail: { url: 'kyc/shop-details' },
    addBusinessDetail: { url: 'kyc/store-business-details' },
    storeUdhyamDetails: { url: 'kyc/store-udyam-details' },

    storeShopDetails: {
      url: 'kyc/store-shop-details'
    },

    addStoreUdyamDetail: {
      url: 'kyc/store-udyam-details'
    },
    addStoreShopDetail: {
      url: 'kyc/store-shop-details'
    },

    getBankList: {
      url: 'bank/bank-master'
    },
    getBankListForFund: {
      url: 'get-bank-list'
    }
    ,
    chequeOcr: {
      url: 'kyc/bank-ocr'
    }
    ,
    saveBankDetail: {
      url: 'kyc/bank-verify'
    },
    finalKycUpdate: {
      url: 'kyc/final-kyc-update'
    },
    createVirtualAccount: {
      url: 'virtual-account'
    },
    adminKycDetail: {
      url: 'kyc/kyc-details'
    },
    getDocumentList: {
      url: 'kyc/document-list'
    },
    uploadDocument: {
      uploadFile: { url: 'upload-file' },
      incorporatepanDetail: { url: 'kyc/pan-ocr' },
      panVerify: { url: 'kyc/pan-verify' },
      coiDetail: { url: 'kyc/coi-verify' },
      gstDetail: { url: 'kyc/gst-ocr' },
      addShopUdyamDoc: { url: 'kyc/udyam-and-otherdoc' },
      moa_aoa_Detail: { url: 'kyc/moa-aoa' },
      boardResolution: { url: 'kyc/board-resolution' },

      partnerPanOcr: { url: 'kyc/partner-panocr' },
      partnerPanverify: { url: 'kyc/partner-panverify' },
      aadharOtp: { url: 'kyc/partner-aadharotp' },
      verifyAadharOtp: { url: 'kyc/partner-aadharverify' },
      verifyVoterId: { url: 'kyc/partner-voteridverify' },
      dlverify: { url: 'kyc/partner-dl' },
      ppverify: { url: 'kyc/partner-pp' },
      aadhar_store: { url: 'kyc/aadhar-store' },
      aadhar_ocr: { url: 'kyc/aadhar-ocr' },
      trustDeed: { url: 'kyc/trust-deed-or-mou' },
      byLawsDoc: { url: 'kyc/bylows-verify' },
      llpAgreement: { url: 'kyc/llp-agreement' },
      letterForPerson: { url: 'kyc/aletter-for-aperson' }
      // panDetail:{url:'company/pan'},
      // voterIdDetail:{url:'business/add'},
    },
    // fetchPanName: {
    //   url: 'document/kyc/pan-fetch'
    // }


  },

  // kyc:{
  //   basicDetails: 'api/basicDetail',
  //   entityType: 'api/entityType',
  //   bankType: 'api/mbanks',
  //   ifscType: 'api/getIfsc',
  //   pennydrop: 'api/pennydrop',
  //   panVerify: '/api/panverify',
  //   aadhaarSendOtp : 'api/aadhaarSendOtp',
  //   aadhaarVerifyOtp: '/api/aadhaarVerifyOtp',
  //   upadateData: 'api/updateData',
  //   allKycDetails: 'api/allKycDetails',
  //   adminApprove:'api/docApprove',
  // },

  businessType: {
    url: 'kyc/business-type'
  },

  businessCategory: {
    url: 'kyc/business-category'
  },

  sendOtp: {
    url: 'kyc/sendOtp'
  },

  verifyOtp: {
    url: 'kyc/verifyOtp'
  },

  location: {
    stateData: 'api/getAllState',
    cityData: 'api/getAllCity'
  },

  qrCreate: {
    url: 'api/createVpa'
  },

  tokenauth: 'e090c25187ee2b3f9f1f8a02747356641',
  Authkey: 'MWQyMmUzNWY4YjhlNjY2NWJjM2EzZjY0NjNhZWM0ZTk=',
};
