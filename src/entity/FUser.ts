/** java
 *     public Long userId;
 *     public String username;
 *     public String avatarUrl;
 *     public boolean isTeacher;
 *     public String email;
 *     public int subscribeCount;
 *     public String password;
 *     public String token;
 */
export class FUser{
    userId: number;
    username: string;
    avatarUrl: string;
    isTeacher: boolean;
    email: string;
    subscribeCount: number;
    password: string;
    token: string;
    constructor(userId: number, username: string, avatarUrl: string, isTeacher: boolean, email: string, subscribeCount: number, password: string, token: string){
        this.userId = userId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.isTeacher = isTeacher;
        this.email = email;
        this.subscribeCount = subscribeCount;
        this.password = password;
        this.token = token;
    }
}