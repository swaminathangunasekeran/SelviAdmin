import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  today:Date = new Date();
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }
}
