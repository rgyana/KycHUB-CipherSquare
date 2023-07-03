


// setting urls
export const config: any = {

  // encrypt and decrypt key
  aesEnc: {
    key: '6fa979f20126cb08aa645a8f495f6d85',
    iv: 'I8zyA4lVhMCaJ5Kg'
  },

  // sidebar related Urls
  sidebar: {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
    url: 'dashboard/dashboard/getsidebar',
  },

  dashboard: {
    transactionList: {
      url: 'recentTransaction'
    },

    leadCount: {
      url: 'dashboard'
    },
    bussinessTrends: {
      url: 'businessTrends'
    },

    userBalance: {
      url: 'userBalance'
    },

    dashboardCount: {
      url: 'dashboad-counts'
    },
    categoryWiseTarget: {
      url: 'category-wise-target'
    },

    paymentModeTransfer: {
      url: 'payment-mode-tranfer'
    },
  },

  tickler: {
    url: 'auth/tickler'
  },

  // Accounts Related URLs
  auth: {
    login: {
      url: 'auth/login',
    },

    verifyOtp: {
      url: 'auth/verify'
    },

    changePassword: {
      url: 'change-password'
    },

    change_user_password: {
      url: 'auth/change-user-password'
    },

    updatePassword: {
      url: 'update-password'
    },

    logout: {
      url: 'user/logout'
    },

    forgetPassword: {
      url: 'auth/user-forgot-password'
    },
    forgetPasswordVerifyOtp: {
      url: 'verifyotp'
    },

    permission: {
      url: 'Settings/Permission'
    },
  },
  // Sign up related urls
  SignUp: {
    createUser: {
      url: 'account/create'
    },
    getCompanyList: {
      url: 'user/company-list'
    },
    assignCompany: {
      url: 'account/company'
    },
    assignContact: {
      url: 'account/contact'
    },
    // *******************
    createNewUser: {
      url: 'user/user-unique'
    },
    ValidateOTP: {
      url: 'user/send-otp'
    },
    sendOTP: {
      url: 'user/user-create'
    },
    sendEmail: {
      url: 'send-verifyemail'
    },
    sendEmailOTP: {
      url: 'emailsendverifyotp'
    },
    verifyEmailOTP: {
      url: 'emailverifyotp'
    }
  },
  //Validate otp related Urls
  ValidateOtp: {
    otp: {
      url: 'account/otp'
    },
  },
  // KYC related Urls

  // White List
  // businessType:{
  //   url: 'kyc/business-type'
  // },
  WhiteList: {
    addWhiteListBank: {
      url: 'bank/add-account'
    },
    whiteListBank: {
      url: 'bank/get-account-list'
    },
  },
  Statements: {
    payoutStatements: {
      url: 'statement',
      download: 'save-axis-payout'
    },

    ledgerStatements: {
      url: 'txn-ledger',
      download: 'save-txn-ledger'
    },

    pennyDropStatements: {
      url: 'penny-statement',
      download: 'save-penny-payout'
    },

  },
  FundRequest: {
    onlineTransfer: {
      url: 'fund/createrequest'
    },
    allRequest: {
      url: 'fund/getrequest'
    },
    allRequestDownload: {
      url: 'fund/request-download'
    }
  },
  NewPayouts: {
    addContact: {
      url: 'payout/add-contact'
    },
    listContact: {
      url: 'payout/list-contact'
    }
  },
  getCredentials:{
    url: 'credentials/get-credentials'
  },
  sendCredentials:{
    url: 'credentials/send-credentials'
  },
  Addbeneficiary: {
    addbeneficiary: {
      url: 'payout/add-bene'
    },
    getbeneficiary: {
      url: 'payout/list-bene'
    },
    getStateMaster: {
      url: 'state'
    },
    getCityMaster: {
      url: 'city'
    },
    getPincode: {
      url: 'pincode'
    },
    get_pincode_details: {
      url: 'get-pincode-details'
    },
  },
  PayoutRequest: {
    otpPayout: {
      url: 'payout/send-otp'
    },
    axisSinglePayout: {
      url: 'payout/axis-single-payout'
    }
  },
  vaAccount: {
    url: 'va/get-virtual-account'
  },

  pennyDrop: {
    url: 'payout/peny_drop'
  },

  chargesslab: {
    url: 'payout/getchargesslab'
  },
  axis_bulk_payout: {
    url: 'payout/axis-bulk-payout'
  },
  payout_otp: {
    url: 'payout/send-payout-otp'

  },
  payout_list: {
    url: 'payout/bulk-payout-list'

  },
  shouldApiEncryptDecrypt:{
    url: 'should-encrypt'
  },
  profilePicture:{
    url: 'user/profile-picture'
  },
  // White List
  notification: {
    updateNotification: {
      url: 'notification/update-notification'
    },
  },
  connected_banking:{
    add_bank:{
      url:'connected-bank/generate-lead'
    },
    open_bank:{
      url:'connected-bank/lead-data'
    },
    bank_balance:{
      url:'connected-bank/balance'
    },
    transfer_fund:{
      url:'connected-bank/transfer'
    },
    status_enquiry:{
      url:'connected-bank/status'
    },
    add_bene:{
      url:'connected-bank/add-bene'
    },
    bene_list:{
      url:'connected-bank/list-bene'
    },
    fav_bene:{
      url:'connected-bank/fav-bene'
    },
    initiate_transfer:{
      url:'connected-bank/transfer'
    },
    statement:{
      url:'connected-bank/statement'
    }
  }
} as const;


