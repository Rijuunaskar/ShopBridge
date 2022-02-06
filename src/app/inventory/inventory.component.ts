import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RestserviceService } from '../restservice.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup,FormControl} from '@angular/forms';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})




export class InventoryComponent implements OnInit, AfterViewInit {
  constructor(private _Rest:RestserviceService,public dialog: MatDialog,private _snackbar:MatSnackBar) {}
  displayedColumns: string[] = ['name','description','price','qty','InventoryValue','Location'];
  products: ProductInterface[] = [];
  dataSource = new MatTableDataSource<ProductInterface>(this.products);
  isadd: boolean = false;
  editdata:any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    if (this.paginator != undefined) this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.getdata();
  }


  deletedata(id:number):void {
    this._Rest.deleteproducts(id).subscribe(e=>{
      this._snackbar.open('Deleted','close');
      this.getdata();
    })
  }

  edit(element:any):void {
    this.isadd=false;
    this.editdata = element;
    this.openDialog();
  }

  adddata(){
    this.isadd=true;
    this.openDialog();
  }

  getdata(){
    this._Rest.getproducts().subscribe(
      products =>{
      this.products =  products;
      this.dataSource = new MatTableDataSource<ProductInterface>(this.products);
      if(this.paginator !=undefined)
        this.dataSource.paginator = this.paginator;
      console.log(products);
    }  
    )
  }

  openDialog(): void {
    
    let data = {title:'Add data','add':true,editdata:this.editdata}
    
    if(!this.isadd){
      data.title='Edit data'
      data.add = false;
      data.editdata=this.editdata;
    }else{
      data.editdata={};
    }


    const dialogRef = this.dialog.open(Adddialog, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getdata();
    });
  }
  
}

export interface ProductInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  qty: number;
  Inventoryvalue: number;
  Location: string;
}

export interface DialogData {
  title: string;
  add:boolean;
  editdata:ProductInterface
}

@Component({
  selector: 'add-dialog',
  templateUrl: 'adddialog.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class Adddialog implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<Adddialog>,private _snackbar:MatSnackBar,private _Rest:RestserviceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
  }

  AdddataFormGroup =  new FormGroup({
    name: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    price: new FormControl(0,Validators.required),
    Location: new FormControl('',Validators.required),
    qty: new FormControl(0,Validators.required)
  })

  
  recreatedata(){
      let id = this.getrandominteger();
      let inventoryvalue = this.getInventoryvalue();
      let data:ProductInterface ={
        "id": id,
        "name": this.AdddataFormGroup.value.name,
        "description": this.AdddataFormGroup.value.description,
        "price": this.AdddataFormGroup.value.price,
        "Inventoryvalue": inventoryvalue,
        "Location":this.AdddataFormGroup.value.Location,
        "qty":this.AdddataFormGroup.value.qty
      };
      return data;
  }

  Addproducts(){
    if(this.data.add){
      let data = this.recreatedata();
      this._Rest.addproducts(data).subscribe(
        products=>{
          this._snackbar.open('Product added successfully','close')
          this.dialogRef.close();
        }
      )
    }else{
      //edit code
      //As I am not using database,here I am deleting  the object first and again adding
      this._Rest.deleteproducts(this.data.editdata.id).subscribe(e=>{
        let data = this.recreatedata();
        this._Rest.addproducts(data).subscribe(
          products=>{
            this._snackbar.open('Modified successfully','close')
            this.dialogRef.close();
          }
        )
      })

    }
  }

  getrandominteger(){
    return Math.floor(Math.random() * 100000);
  }

  getInventoryvalue(){
    //inventory value calculation
    return Math.floor(Math.random() * 10000);
  }

  close(){
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}