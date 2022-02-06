import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navItems=[
    {name:"Dashboard",icon:"dashboard",active:false},
    {name:"Products",icon:"inventory_2",active:true},
    {name:"User",icon:"inventory",active:false},
    {name:"Category",icon:"category",active:false},
    {name:"Order",icon:"list_alt",active:false},
    {name:"Company",icon:"business",active:false}
    
  ];
  constructor(private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  handlenav(item:any):void {
    this.navItems.map(e=>{
      if(e.name == item.name){
        e.active = true;
      }else{
        e.active = false;
      }
    })
    setTimeout(()=>{
      this._snackbar.open('Routing is not implemented yet...','Close');
      this.navItems.map(e=>{
        if(e.name == "Products"){
          e.active = true;
        }else{
          e.active = false;
        }
      })
    },2000)
  }

}
