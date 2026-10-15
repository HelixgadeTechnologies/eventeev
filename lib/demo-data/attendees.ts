export interface AttendeesDataType {
  id: string;
  name: string;
  email: string;
  dateRegistered: string;
  checkedIn: boolean;
}

export const checkInData: Array<AttendeesDataType> = [];