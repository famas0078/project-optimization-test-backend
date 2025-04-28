export interface RegistrationOrganizationInterface {
  name: string;
  department?: string;
  notes?: string;
}

export interface RegistrationUserInterface {
  email: string;
  password: string;
  roleId: number;
  firstName: string;
  lastName: string;
  middleName: string;
}
