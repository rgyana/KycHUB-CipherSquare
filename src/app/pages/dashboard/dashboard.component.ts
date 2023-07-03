import { ToasterService } from '@core/services/toaster.service';
import { config } from '@core/interfaces/api_baseurl';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SeoService } from '@core/services/seo.service';

import { StoreService } from '@core/services/store.service';
import { AuthService } from '@core/services/auth.service';
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';
import { DatePipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  // tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  labels: string[];
  responsive: ApexResponsive[];
  colors: string[];
  plotOptions: ApexPlotOptions;
};
export type barOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  credits:any;
  verifyPasswordForm: any = UntypedFormGroup;
  dateForm: any = UntypedFormGroup;
  userDetails: any;
  list: any = 1;
  serviceData: any = [
    {
      service: '',
      totalcount: '',
      todaytotal: '',
    },
    {
      service: '',
      totalcount: '',
      todaytotal: '',
    },
    {
      service: '',
      totalcount: '',
      todaytotal: '',
    },
  ];
  minDate: any;
  maxDate: any;
  date: any;
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker:
    | BsDatepickerDirective
    | any;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public barOptions: Partial<ChartOptions> | any;
  public barOptions1: Partial<ChartOptions> | any;
  pie_data: any = [];
  bardata: any = [];

  constructor(
    private _seoService: SeoService,
    private store: StoreService,
    private auth: AuthService,
    private fb: UntypedFormBuilder,
    private toaster: ToasterService,
    private datePipe: DatePipe
  ) {
    this.generateDougtnutChart();
    this.generateBarGraph();
    this.generateBarGraph1();
    this.FormControIntilisation();

  }

  ngOnInit() {
    // this._seoService.setSeoData('Dashboard');
    // this.showService();
    // this.dougtnutChartApi();
    // this.barGraphApi();
  }

  //FormControIntilisation
  FormControIntilisation() {
    this.dateForm = this.fb.group({
      date: ['', new Date()],
    });
  }

  convertUppercase(val: any) {
    return val;
  }

  //Implementation of Dougtnut graph
  generateDougtnutChart() {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function (
          val: string,
          opts: {
            w: { globals: { series: { [x: string]: string } } };
            seriesIndex: string | number;
          }
        ) {
          return opts.w.globals.series[opts.seriesIndex];
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  //api integration in Dougtnut graph
  // dougtnutChartApi() {
  //   this.auth
  //     .postHeaderwithoutpayload(config.dashboard.pie_chart)
  //     .subscribe((res: any) => {
  //       if (res.statuscode == 200) {
  //         this.chartOptions.series = res.value;
  //         this.chartOptions.labels = res.name;
  //       }
  //     });
  // }

  // barGraphApi() {
  //   this.auth
  //     .postdata(this.setformData(), config.dashboard.bar_graph)
  //     .subscribe((res: any) => {
  //       if (res.statuscode == 200) {
  //         this.barOptions.series = [
  //           {
  //             name: '',
  //             data: res.value,
  //           },
  //         ];
  //         this.barOptions.xaxis = {
  //           categories: res.name,
  //         };
  //       }
  //     });
  // }

  setformData() {
    let search: any = {};
    search.startdate = this.datePipe.transform(
      this.dateForm.get('date').value[0],
      'yyyy-MM-dd'
    );
    search.enddate = this.datePipe.transform(
      this.dateForm.get('date').value[1],
      'yyyy-MM-dd'
    );

    let formData = new FormData();
    formData.append('fromdate', search.startdate);
    formData.append('todate', search.enddate);

    return formData;
  }

  //Implementation of bar graph
  generateBarGraph() {
    this.barOptions = {
      series: [
        {
          name: 'Servings',
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],
      annotations: {
        points: [
          {
            x: 'Bananas',
            seriesIndex: 0,
          },
        ],
      },
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '50%',
          endingShape: 'rounded',
        },
      },

      dataLabels: {
        enabled: false,
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: [
          'Current Account',
          'Saving Account',
          'Personal Loan',
          'Home Loans',
          'Car Loan',
          'Gold Loan',
        ],
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: 'Total Application',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            {
              offset: 50,
              color: 'var(--secendary-color)',
              opacity: 1,
            },
            {
              offset: 50,
              color: 'var(--primary-color)',
              opacity: 1,
            },
          ],
        },
      },
    };
  }
  generateBarGraph1() {
    this.barOptions1 = {
      series: [
        {
          name: 'Total Application',
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],

      annotations: {
        points: [
          {
            x: 'Bananas',
            seriesIndex: 0,
          },
        ],
      },
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '50%',
          endingShape: 'rounded',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            {
              offset: 50,
              color: 'var(--secendary-color)',
              opacity: 1,
            },
            {
              offset: 50,
              color: 'var(--primary-color)',
              opacity: 1,
            },
          ],
        },
      },
      dataLabels: {
        enabled: false,
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: [
          'Review',
          'Completed',
          'Process',
          'Hold',
          'Granted',
          'Reject',
        ],
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: 'Current Account Application',
        },
      },
    };
  }

  // showService() {
  //   this.auth
  //     .postHeaderwithoutpayload(config.dashboard.dashboard_api)
  //     .subscribe((res: any) => {
  //       if (res.statuscode == 200) {
  //         this.toaster.showSuccess(res.message, 'Success');
  //         //  this.serviceData = res.data;
  //         this.credits =  res.credits;
  //         Object.keys(res.data).map((index) => {
  //           this.serviceData.push(res.data[index]);
  //         });
  //       } else {
  //         this.toaster.showError(res.message, 'Error');
  //       }
  //     });
  // }

  // onChangeDate() {
  //   this.dougtnutChartApi();
  //   this.barGraphApi();
  // }
}
