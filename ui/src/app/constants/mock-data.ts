import {User} from "../models/user";
import {Question} from "../models/question";
import {Answer} from "../models/answer";

const mockData = {
  questions: [
    new Question(1,1,"How I jump irl?","Please help i dont know how to jump irl","21/04/2024"),
    new Question(2,1,"How I walk irl?","I walk know not","21/04/2024"),

  ],
  users: [
    new User(1, "test", "test", "04/11/2002"),
    new User(2, "helper","helper","01/11/2006"),
  ],

  answers: [
    new Answer(1,1,2,"What?","21/04/2024"),
    new Answer(2,1,2,"Bend your knees then jump","21/04/2024"),
    new Answer(3,1,1,"Impossibru","21/04/2024"),
  ],

  getUserWithoutPassword(userId: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      return { id: user.id, username: user.username, joinDate: user.joinDate};
    } else {
      return null;
    }
  }

};
export default mockData;
