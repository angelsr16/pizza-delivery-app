import { FormControl } from '@angular/forms';

export interface CustomerRegistrationFormGroup {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}
