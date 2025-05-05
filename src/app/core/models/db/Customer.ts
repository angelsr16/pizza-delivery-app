import { DeliveryLocation } from './DeliveryLocation';
import { DocumentBase } from './DocumentBase';

export interface Customer extends DocumentBase {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  deliveryLocation: DeliveryLocation;
}
