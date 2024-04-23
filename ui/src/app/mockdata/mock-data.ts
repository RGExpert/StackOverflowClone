let mockData = {
  "questions": [
    {
      "qId": 1,
      "authorId": 1,
      "title": "How I jump irl?",
      "text": "Please help i dont know how to jump irl",
      "creationDate": "21/04/2024",
      "path":"./assets/placeholder.jpg"
    },
    {
      "qId": 2,
      "authorId": 1,
      "title": "How I walk irl?",
      "text": "I walk know not",
      "creationDate": "21/04/2024",
      "path":"./assets/placeholder.jpg"
    }
  ],
  "users": [
    {
      "id": 1,
      "username": "test",
      "password": "test",
      "joinDate": "04/11/2002"
    },
    {
      "id": 2,
      "username": "helper",
      "password": "helper",
      "joinDate": "01/11/2006"
    }
  ],
  "answers": [
    {
      "aId": 1,
      "qId": 1,
      "authorId": 2,
      "text": "What?",
      "creationDate": "21/04/2024"
    },
    {
      "aId": 2,
      "qId": 1,
      "authorId": 2,
      "text": "Bend your knees then jump",
      "creationDate": "21/04/2024"
    },
    {
      "aId": 3,
      "qId": 1,
      "authorId": 1,
      "text": "Impossibru",
      "creationDate": "21/04/2024"
    },
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
