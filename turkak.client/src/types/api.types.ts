
// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  errors?: string[];
}

// Employee DTOs - Backend ile uyumlu
export interface EmployeeDto {
  employeeId?: number;
  employeeNameSurname: string;
  employeeUserName: string;
  employeePassword: string;
  employeeRole: string;
  employeeStatus?: boolean;
}

export interface EmployeeLoginDto {
  employeeUserName: string;
  employeePassword: string;
}

export interface EmployeeLoginResponseDto {
  token: string;
  employeeId: number;
  employeeNameSurname: string;
  employeeRole: string;
  employeeUserName: string;
  tokenExpiry: string;
}

// Customer DTOs - Backend ile uyumlu
export interface CustomerDto {
  customersId?: number;
  taxNumber: string;
  title: string;
  brandInfo: string;
  customersAddress: string;
  phoneNumber: string;
  email: string;
  website?: string;
  country: string;
  city: string;
  files: string;
  accountType: string;
}

// Certificate DTOs - Backend ile uyumlu
export interface CustomersCertificateDto {
  certificateId?: number;
  customer: number;
  deviceType: number;
  deviceSerialNo: string;
  referenceCalibrator: number;
  referenceCalibratorSerialNo: number;
  calibratorEmployee: number;
  calibratorLocation: string;
  calibratorDate: string;
  firstAirDate: string;
  revisionDate: string;
  revisionNote?: string;
  customerName?: string;
  deviceTypeName?: string;
  employeeName?: string;
  referenceDeviceName?: string;
}

// Device Type DTOs - Backend ile uyumlu
export interface NewDeviceTypeDto {
  newDeviceTypeId?: number;
  deviceTypeName: string;
  deviceTypeComment?: string;
  referenceCalibrator: number;
  referenceCalibratorName?: string;
}

// Reference Device DTOs - Backend ile uyumlu
export interface ReferenceDeviceAddDto {
  referenceDeviceId?: number;
  referenceDeviceName: string;
  serialNo: string;
  comment?: string;
  deviceType: string;
  status: boolean;
  lastCalibratorDate: string;
  nextCalibratorDate: string;
}

// TurkAK Account DTOs - Backend ile uyumlu
export interface TurkAkaccDto {
  turkakAccId?: number;
  turkakAccUserName: string;
  turkakAccPassword: string;
  token: string;
  tokenExpiry: string;
}

export interface TurkAkaccLoginDto {
  turkakAccUserName: string;
  turkakAccPassword: string;
}

// TBDS DTOs - TürkAK API için
export interface CalibrationCustomerDataDto {
  countries: CountryDto[];
  cities: CityDto[];
  dvAccountTypes: AccountTypeDto[];
  files: FileDto[];
}

export interface CountryDto {
  id: number;
  name: string;
}

export interface CityDto {
  id: number;
  countryId: number;
  name: string;
}

export interface AccountTypeDto {
  value: number;
  description: string;
}

export interface FileDto {
  id: number;
  code: string;
}

export interface CertificateCustomerDto {
  id: string;
  name: string;
}

export interface CalibrationCertificateListItemDto {
  id: string;
  customerId: string;
  tbdsNumber: string;
  certificationBodyDocumentNumber: string;
  state: string;
}
