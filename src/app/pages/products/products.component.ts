import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {AddProductComponent} from './add-product/add-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private modalService:NgbModal) { }

  ngOnInit(): void {
    this.modalService.open(AddProductComponent,{size:"xl"});
  }

  addProductModal():void{
    this.modalService.open(AddProductComponent,{size:"xl"});
  }

}
