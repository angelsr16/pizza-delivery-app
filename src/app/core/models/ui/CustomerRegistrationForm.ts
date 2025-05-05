import { DeliveryLocation } from '../db/DeliveryLocation';

export interface CustomerRegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deliveryLocation: DeliveryLocation;
}
