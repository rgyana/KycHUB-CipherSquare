import { kycServiceStepsInterface } from '@core/interfaces/kycServiceSteps.interface';

export const KYC_Service_Steps: kycServiceStepsInterface[] = [
  { name: 'Contact Details', stepNum: 1, sub_type: [], status: 4 },
  { name: 'Business Details', stepNum: 2, sub_type: [], status: 4 },
  { name: 'Verify Documents', stepNum: 3, sub_type: [], status: 4 },
  { name: 'Bank Details', stepNum: 9, sub_type: [], status: 4 },
];
