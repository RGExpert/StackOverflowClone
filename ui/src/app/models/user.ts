export class User {
  id : number;
  username: string;
  password:string;
  joinDate:string

  constructor(id: number, username: string, password: string, joinDate: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.joinDate = joinDate;
  }
}
