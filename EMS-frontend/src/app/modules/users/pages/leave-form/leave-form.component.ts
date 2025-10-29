import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LeaveService } from 'src/app/core/service/leave.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent implements OnInit {

  @Output() leaveAdded = new EventEmitter<void>();
 message = '';
  minDate = new Date();

  leaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', [Validators.required, Validators.minLength(5)]],
  });

  leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave'];

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {}

  ngOnInit(): void {}

  onSubmit() {
  if (this.leaveForm.invalid) {
    this.message = '❌ Please fill all required fields.';
    return;
  }

  //const payload = this.leaveForm.value;

  // Call the LeaveService API
  this.leaveService.requestLeave(this.leaveForm.value).subscribe({
    next: (res) => {
      console.log('✅ Leave request successful:', res);
      this.message = '✅ Leave request submitted successfully!';
       this.leaveAdded.emit();
      this.leaveForm.reset();
    },
    error: (err) => {
      console.error('❌ Error submitting leave request:', err);
      this.message = '❌ Failed to submit leave request.';
    },
  });
}


  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const start = this.leaveForm.get('startDate')?.value;
    const end = this.leaveForm.get('endDate')?.value;

    if (start && end && start > end) {
      this.leaveForm.get('endDate')?.setErrors({ invalidRange: true });
    }
  }

}
