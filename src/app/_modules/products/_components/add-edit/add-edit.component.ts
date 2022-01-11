import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../../../../_services/product/product.service";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
 productId: string;
  constructor(private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((map:ParamMap) => {
        this.productId = map.get('id') as string;
        this.productService.getById(Number(this.productId)).subscribe((result:any) =>{
          this.images = result.fileSource;
          this.myForm.patchValue(result);
        });
        }
      );

  }

  images = [];
  myForm = new FormGroup({
    customerId:new FormControl(''),
    userId:new FormControl(JSON.parse(localStorage.getItem('current-user') || '')?.id || null),
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  get f() {
    return this.myForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          // @ts-ignore
          this.images.push(event.target.result);

          this.myForm.patchValue({
            fileSource: this.images
          });
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  submit() {
    this.productService.addNewProduct(this.myForm.value);
  }

  clear() {
    this.myForm.reset();
    this.images = [];
  }
}
