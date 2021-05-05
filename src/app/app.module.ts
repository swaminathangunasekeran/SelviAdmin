import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import {APOLLO_OPTIONS,APOLLO_NAMED_OPTIONS, NamedOptions} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// import { AddProductComponent } from './pages/products/add-product/add-product.component';
import {AuthGuard} from "./service/authguard.service"

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    // AddProductComponent,
   
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    SidebarModule,
    BrowserModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule
  ],
  providers: [AuthGuard,{             
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      const authToken = localStorage.getItem("authToken") || "";
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:3000/general',
          headers: new HttpHeaders({
            "Authorization":authToken
          })
        }),
      };
    },
    deps: [HttpLink],
  },{
    provide: APOLLO_NAMED_OPTIONS,
    useFactory:(httpLink: HttpLink) :NamedOptions=>{
      const authToken = localStorage.getItem("authToken") || "";
     // alert("GRAPHQL")
      return{
        loggedInUser:{
          cache: new InMemoryCache(),
          defaultOptions:{
            watchQuery:{
              errorPolicy:"all"
            }
          },
          link: httpLink.create({
            uri: 'http://localhost:3000/generalUser',
            headers: new HttpHeaders({
              "Authorization": authToken
            })
  
          }),
        }
        
      }
    }, deps: [HttpLink]
  },{
    provide: APOLLO_NAMED_OPTIONS,
    useFactory:(httpLink: HttpLink) :NamedOptions=>{
      const authToken = localStorage.getItem("authToken") || "";
     // alert("GRAPHQL")
      return{
        adminUser:{
          cache: new InMemoryCache(),
          defaultOptions:{
            watchQuery:{
              errorPolicy:"all"
            }
          },
          link: httpLink.create({
            uri: 'http://localhost:3000/admin',
            headers: new HttpHeaders({
              "Authorization": authToken
            })
  
          }),
        }
        
      }
    }, deps: [HttpLink]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
