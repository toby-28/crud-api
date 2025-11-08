export interface User {
  id: string;           // UUID generated on server
  username: string;     // Required
  age: number;          // Required
  hobbies: string[];    // Required (can be empty)
}