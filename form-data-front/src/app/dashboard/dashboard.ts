import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { Router ,RouterModule  } from '@angular/router';
import { FormBuilder, FormGroup ,FormControl, Validators ,ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../services/socket';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit , OnDestroy {
  user: any = null;
  editForm!: FormGroup;
  isEditMode = false;
  messageForm! : FormGroup;
  messageSub !: Subscription;
  receivedMessage: string[] = [];

  constructor(private authService: AuthService ,
              private router: Router ,
              private fb: FormBuilder,
              private http: HttpClient,
              private socketService:SocketService) {}

  ngOnInit(): void {
    this.authService.dashboard().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        this.user = data?.user || data; // Handles both possibilities
      },
      error: (err) => {
        console.error('Dashboard fetch error:', err);
      }
    });

//     this.editForm = this.fb.group({
//     email: [this.user.email, [Validators.required, Validators.email]],
//     address: [this.user.address],
//     designation: [this.user.designation],
//     dob: [this.user.dob?.split('T')[0]],
//     phone: [this.user.phone]
// });
    this.messageForm = this.fb.group({
      message:['' , Validators.required]
    });

    this.socketService.onMessage().subscribe(msg =>{
      this.receivedMessage.push(msg);
    });

    this.messageSub = this.socketService.onMessage().subscribe(msg =>{
      this.receivedMessage.push(msg);
    });
  }

  ngOnDestroy():void {
    this.messageSub?.unsubscribe();
  }
  logout(): void{
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  toggleEditMode(){
    this.isEditMode = !this.isEditMode;
    if(this.isEditMode && this.user){
      this.editForm = this.fb.group({
        email :this.user.email,
        address:[this.user.address],
        designation :[this.user.designation],
        dob : [this.user.dob?.split('T')[0]],
        phone :[this.user.phone],
      });
    }
  }
  onUpdate(){
    const updateData = this.editForm.value;
    this.http.put('http://localhost:3333/use/update-profile',updateData, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem('token')}`,
      },
    }).subscribe({
      next:(res)=>{
        console.log('Update success' ,res);
        this.user ={...this.user  , ...this.editForm.value};
        this.isEditMode = false;
      },
      error:(err)=>{
        console.log('Update Success',err);
      },
    });
  }

  sendMessage(){
    if(this.messageForm.valid){
        const msg = this.messageForm.value.message;
        this.socketService.sendMessage(msg);
        this.messageForm.reset();
    }
  }

  updateViaSocket() {
  if (this.editForm.valid) {
    const data = { id : this.user.id , ...this.editForm.value};

    this.socketService.updateProfile(data);
    console.log("Sending data via socket ",data);

    this.socketService.onUpdateSuccess().subscribe(res => {
      console.log("Update Success via Socket",res);
      this.user = {...this.user , ...this.editForm.value};
      this.isEditMode = false;
      alert('Updated Via Socket');
      console.log('Success:', res);
    });
    this.socketService.onUpdateError().subscribe(err => {
      console.error('Error:', err);
    });
  }
}

}




