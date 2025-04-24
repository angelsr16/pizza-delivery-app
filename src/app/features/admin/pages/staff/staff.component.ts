import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StaffService } from '../../../../core/services/staff.service';
import { Staff } from '../../../../core/models/db/Staff';
import { StaffFormComponent } from './staff-form/staff-form.component';

@Component({
  selector: 'app-staff',
  imports: [
    FloatLabelModule,
    InputIconModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    IconFieldModule,
    TableModule,
    ButtonModule,
    StaffFormComponent,
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss',
})
export class StaffComponent {
  staffList: Staff[] = [];
  staffListToShow: Staff[] = [];

  filterData: any = {
    search: '',
  };

  currentEmployee: Staff | undefined;
  displayStaffForm: boolean = false;

  constructor(private staffService: StaffService) {
    this.staffService.staff$.subscribe((data) => {
      this.staffList = data as Staff[];
      this.staffListToShow = data as Staff[];
    });
  }

  hideStaffForm() {
    this.displayStaffForm = false;
    this.currentEmployee = undefined;
  }

  handleFilterData() {}
}
