export class Collaborator {
  id: number;
  username: string;
  photoUrl: string;

  constructor(collaborator: any = {}) {
    this.id = collaborator.id;
    this.username = collaborator.username;
    this.photoUrl = collaborator.photoUrl;
  }
}
