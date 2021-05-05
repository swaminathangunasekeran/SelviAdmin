import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormBuilder,FormArray } from '@angular/forms';
import {Apollo, gql,ApolloBase} from 'apollo-angular';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  fb:FormBuilder = new FormBuilder();
  productForm:FormGroup;
  industryList:Array<any>;     
  bussinessList:Array<any>;
  categoryList:Array<any>;
  sectionList:Array<any>;
  bussinessListFetch=0;
  industryListFetch=0;
  private admin:ApolloBase;
  productAddStatus= 0;
  productId  = "";
  constructor(private apollo:Apollo,private appolloProvider:Apollo,) {
    this.admin = this.appolloProvider.use("adminUser")
   }

  ngOnInit(): void {
    this.productForm = this.fb.group({
        industry: new FormControl(""),
        bussiness : new FormControl(""),
        category:new FormControl(""),
        section: new FormControl(""),
        name : new FormControl(""),
        img:new FormControl(""),
        measurements : this.fb.array([this.createMeasureMent()])
    })
    this.getIndustry();
  }

  createMeasureMent():FormGroup{
    return this.fb.group({
      name : new FormControl(),
      size: new FormControl(),
      sizename: new FormControl()
    })
  }
  addMeasureMent():void{
       const measurements = this.fb.group({
        name : new FormControl(),
        size: new FormControl(),
        sizename: new FormControl()
       })
      this.measurement.push(measurements);
  }

  removeMeasurement(index):void{
    this.measurement.removeAt(index);
  }

  getIndustry(){
  
    this.apollo
      .watchQuery({
        query: gql`
          {
            industries{
              name,
              createdDate,
              id
            }
          }
        `,
      }).valueChanges.subscribe((result:any) => {
          console.log("REsult",result);
          if(result && result.data && result.data.industries){
            this.industryList = result.data.industries;
            this.industryListFetch = 1;
          }else{
            this.industryListFetch= -1;
          }
      })
  }

  fetchBussiness(event){
    console.log("INDUSTRYID",event);
    this.productAddStatus = 0;
    this.bussinessList =[];
    this.categoryList = [];
    this.sectionList = []; 
    this.productForm.controls["bussiness"].setValue("");
    this.productForm.controls["category"].setValue("");
    this.productForm.controls["section"].setValue("");
    const query = `{
      getBussinessesById(industryId:"${event.target.value}"){
        name,
        id,
        createdDate,
        industryId,
    		img,
    		location,
        phoneNumber,
   			city
    
    }
    }`
    this.apollo
    .watchQuery({
      query: gql`${query}`
    }).valueChanges.subscribe((result:any) => {
     // console.log("RESULT",result)
      if(result && result.data && result.data.getBussinessesById){
        this.bussinessList = result.data.getBussinessesById;
        this.bussinessListFetch = 1;
      }else{
        this.bussinessListFetch = -1;
      }
       
    })
  }

  fetchCategory(event){
    this.categoryList = [];
    this.sectionList = []; 
    this.productForm.controls["category"].setValue("");
    this.productForm.controls["section"].setValue("");
    const query = `
    {
      getCategoryByBID(bussinessid:"${event.target.value}"){
        name,
        id,
        createdDate,
        bussinessId,
        sectionList{
          name,
          id
        }
        bussinessDetails{
          name,
          img,
          location,
          city
        }
      }
    }`
    this.apollo
    .watchQuery({
      query: gql`${query}`
    }).valueChanges.subscribe((result:any) => {
      console.log("RESULT",result);
      this.categoryList = [];
      if(result && result.data && result.data.getCategoryByBID){
          this.categoryList = result.data.getCategoryByBID;
          console.log("CategoryList",this.categoryList);
          // this.bussinessDetails =this.categoryList[0] ? this.categoryList[0].bussinessDetails : null;
      }
      
    })
  }

  fetchSectionList(event){
    this.sectionList = []; 
    this.productForm.controls["section"].setValue("");
      console.log("EVENT Value",event.target.value);
      this.sectionList =  this.categoryList[event.target.value].sectionList;
  }

  
  addProduct(){
    console.log("ProductForm",this.productForm.value);
    const productDetails = this.productForm.value;
    this.productAddStatus = 1;
    // const measurements = JSON.stringify(productDetails.measurements);
    let measurements = '';
    for(let i=0; i< productDetails.measurements.length ; i++){
      if( i == productDetails.measurements.length -1 ){
        measurements += `{
          name :"${productDetails.measurements[i].name}",
          sizename:"${ productDetails.measurements[i].sizename}",
          size:"${productDetails.measurements[i].size}"
      }`
      }else{
        measurements += `{
          name :"${productDetails.measurements[i].name}",
          sizename:"${ productDetails.measurements[i].sizename}",
          size:"${productDetails.measurements[i].size}"
      },`
      }
      
    }
  
 
    const query = `{
    addProduct(
    name:"${productDetails.name}",
    sectionId:"${productDetails.section}",
    img: "${productDetails.img}",
    measurements:[${measurements}]){
    id,
    name,
    sectionId,
    measurements{
    	name,
      sizename,
      size
      }
    }
  }`
  console.log("Measurement",query)
  this.admin
  .watchQuery({
    query: gql`${query}`
  }).valueChanges.subscribe((result:any) => {
   console.log("RESULT",result);
   if(result.data && result.data.addProduct){
    this.productId = result.data.addProduct.id;
    this.productAddStatus = 2
   }else{
    this.productAddStatus = -1
   }
  })
  }

   get measurement() {
      return this.productForm.get("measurements") as FormArray;
    }

}
