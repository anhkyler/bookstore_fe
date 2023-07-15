import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId:number | undefined;
  currentCategoryName: string = "";
  searchMode:boolean =false ;
  thePageNumber:number = 1;
  theTotalElements: number=0;
  thePageSize:number=5;
  previoudCategoryId: number = 1;
  previousKeyword: string = "";
  constructor(private productService: ProductService,
    private route:ActivatedRoute) {   }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    // this.listProducts();
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
    
  }

  handleSearchProducts() {
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    if(this.previousKeyword != searchKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = searchKeyword;
    this.productService.getProductBynamePaginate(this.thePageNumber - 1,
                          this.thePageSize, searchKeyword).subscribe(this.processResult());
  }

  processResult(){
    return (data : any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  handleListProducts(){
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id')! ;
        this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    console.log(this.currentCategoryName);
    console.log(this.route.snapshot.paramMap);
    if(this.previoudCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previoudCategoryId = this.currentCategoryId;
    console.log(this.previoudCategoryId);
    // console.log(this.route.snapshot.paramMap);
    this.productService.getProductListPagination(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

  updatePageSize(pageSize:string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
