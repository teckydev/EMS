import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kpicard',
  templateUrl: './kpicard.component.html',
  styleUrls: ['./kpicard.component.scss']
})
export class KpicardComponent implements OnInit {
@Input() title!: string;              // Card title
  @Input() value!: number | string;     // KPI value
   @Input() icon!: string;    
   @Input() color!: string;   
  constructor() { }

  ngOnInit(): void {
  }

}
