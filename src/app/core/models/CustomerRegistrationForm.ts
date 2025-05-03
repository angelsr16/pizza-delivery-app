export interface CustomerRegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  deliveryLocation: DeliveryLocation;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
}
