import { CustomFile } from '../CustomFile';
import { DocumentBase } from './DocumentBase';

export interface Staff extends DocumentBase {
  uid: string;
  name: string;
  employeeId: string;
  photoFile: CustomFile;
  roles: string[];
}

export interface RawStaffData {
  name: string;
  roles: string[];
}
