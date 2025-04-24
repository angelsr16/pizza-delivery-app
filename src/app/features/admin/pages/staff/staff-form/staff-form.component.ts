import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RawStaffData, Staff } from '../../../../../core/models/db/Staff';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageFileUploaderComponent } from '../../../../../shared/components/image-file-uploader/image-file-uploader.component';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ROLE_OPTIONS } from '../../../../../core/constants/roles';
import { StaffService } from '../../../../../core/services/staff.service';
import { UtilsService } from '../../../../../core/services/utils.service';

@Component({
  selector: 'app-staff-form',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ImageFileUploaderComponent,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './staff-form.component.html',
  styleUrl: './staff-form.component.scss',
})
export class StaffFormComponent implements OnInit {
  @Input() staff: Staff | undefined;
  @Output() onDismiss: EventEmitter<any> = new EventEmitter();

  photoFile: File | undefined;

  staffForm!: FormGroup;
  isLoading: boolean = false;

  replaceCurrentImage: boolean = false;

  roleOptions: any = [];
  selectedRoles: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private staffService: StaffService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.staffForm = this.buildForm(this.staff);

    if (!this.staff) {
      this.staffForm.addControl(
        'login',
        this.formBuilder.group({
          email: ['', [Validators.required, Validators.email]],
          password: [
            this.utilsService.generateRandomPasscode(10),
            [Validators.required, Validators.min(8)],
          ],
        })
      );
    }

    this.roleOptions = ROLE_OPTIONS.map((role) => {
      return {
        ...role,
        disabled: false,
      };
    });
  }

  updateAvailableOptions() {
    const selectedRoles = this.roles.value.map((role: any) => {
      return role.role;
    });

    this.roleOptions.forEach((option: any) => {
      option.disabled = false;
      if (selectedRoles.includes(option.value)) {
        option.disabled = true;
      }
    });
  }

  buildForm(data?: any): FormGroup {
    return this.formBuilder.group({
      name: [data?.name || '', Validators.required],
      roles: this.formBuilder.array(
        data
          ? this.buildRoleFormGroupFromList(data.sizes)
          : [this.buildRoleFormGroup()]
      ),
    });
  }

  buildRoleFormGroup(): FormGroup {
    return this.formBuilder.group({
      role: ['', Validators.required],
    });
  }

  buildRoleFormGroupFromList(roles: string[]): FormGroup[] {
    const formList: any[] = [];
    roles.forEach((role) => {
      formList.push(
        this.formBuilder.group({
          role: [role, Validators.required],
        })
      );
    });

    return formList;
  }

  get roles(): FormArray {
    return this.staffForm.get('roles') as FormArray;
  }

  addRole() {
    this.roles.push(
      this.formBuilder.group({
        role: ['', Validators.required],
      })
    );
  }

  removeRole(index: number) {
    this.roles.removeAt(index);
    this.updateAvailableOptions();
  }

  async handleRegisterStaff() {
    if (this.photoFile) {
      this.isLoading = true;
      const rawStaffForm = this.staffForm.getRawValue();
      const login = rawStaffForm.login;
      delete rawStaffForm.login;

      const roleStrings = rawStaffForm.roles.map((r: any) => r.role);

      const rawStaffData = {
        ...rawStaffForm,
        roles: [...roleStrings, 'internalUser'],
      };

      await this.staffService.registerEmployee(
        rawStaffData,
        this.photoFile,
        login
      );
      this.isLoading = false;
      this.onDismiss.emit();
    }
  }

  async handleUpdateStaff() {
    if (this.staff) {
      this.isLoading = true;
      const rawStaff = this.staffForm.getRawValue();
      await this.staffService.updateStaff(this.staff, rawStaff, this.photoFile);
      this.isLoading = false;
      this.onDismiss.emit();
    }
  }

  setImageFile(file: File | undefined) {
    this.photoFile = file;

    if (this.staff && !file) {
      this.replaceCurrentImage = false;
    }
  }
}
