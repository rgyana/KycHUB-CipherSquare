export interface kycServiceStepsInterface {
    name: string;
    stepNum: number;
    sub_type: {
        id: number
        name: string
        value: string
        is_edit: number
        step: number
    }[];
    status: number;
}