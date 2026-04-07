export interface AttendeesDataType {
  id: string;
  name: string;
  email: string;
  dateRegistered: string;
  checkedIn: boolean;
}

export const checkInData: Array<AttendeesDataType> = [
  { id: "1", name: "Alice Thompson", email: "alice.thompson@example.com", dateRegistered: "2025-08-01", checkedIn: true },
  { id: "2", name: "Brian Carter", email: "brian.carter@example.com", dateRegistered: "2025-08-02", checkedIn: false },
  { id: "3", name: "Clara Nguyen", email: "clara.nguyen@example.com", dateRegistered: "2025-08-03", checkedIn: true },
  { id: "4", name: "Derek Patel", email: "derek.patel@example.com", dateRegistered: "2025-08-05", checkedIn: false },
  { id: "5", name: "Elena Rodriguez", email: "elena.rodriguez@example.com", dateRegistered: "2025-08-07", checkedIn: true },
  { id: "6", name: "Frank Sullivan", email: "frank.sullivan@example.com", dateRegistered: "2025-08-09", checkedIn: true },
  { id: "7", name: "Grace Kim", email: "grace.kim@example.com", dateRegistered: "2025-08-11", checkedIn: false },
  { id: "8", name: "Henry Brooks", email: "henry.brooks@example.com", dateRegistered: "2025-08-13", checkedIn: true },
  { id: "9", name: "Isabelle Foster", email: "isabelle.foster@example.com", dateRegistered: "2025-08-15", checkedIn: false },
  { id: "10", name: "Jack Moreno", email: "jack.moreno@example.com", dateRegistered: "2025-08-17", checkedIn: true },
  { id: "11", name: "Kylie Bennett", email: "kylie.bennett@example.com", dateRegistered: "2025-08-19", checkedIn: false },
  { id: "12", name: "Liam Hayes", email: "liam.hayes@example.com", dateRegistered: "2025-08-21", checkedIn: true },
  { id: "13", name: "Maya Gupta", email: "maya.gupta@example.com", dateRegistered: "2025-08-23", checkedIn: false },
  { id: "14", name: "Noah Fisher", email: "noah.fisher@example.com", dateRegistered: "2025-08-25", checkedIn: true },
  { id: "15", name: "Olivia Chang", email: "olivia.chang@example.com", dateRegistered: "2025-08-27", checkedIn: false },
  { id: "16", name: "Peter Walsh", email: "peter.walsh@example.com", dateRegistered: "2025-08-29", checkedIn: true },
  { id: "17", name: "Quinn Larson", email: "quinn.larson@example.com", dateRegistered: "2025-08-31", checkedIn: false },
  { id: "18", name: "Rachel Ortiz", email: "rachel.ortiz@example.com", dateRegistered: "2025-09-02", checkedIn: true },
  { id: "19", name: "Samuel Reed", email: "samuel.reed@example.com", dateRegistered: "2025-09-04", checkedIn: false },
  { id: "20", name: "Tara Simmons", email: "tara.simmons@example.com", dateRegistered: "2025-09-06", checkedIn: true }
];