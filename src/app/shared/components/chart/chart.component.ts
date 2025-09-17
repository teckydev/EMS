import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
 @Input() chartType: ChartType = 'bar';
  @Input() chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  @Input() chartOptions: ChartOptions = { responsive: true };
  @Input() title: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
