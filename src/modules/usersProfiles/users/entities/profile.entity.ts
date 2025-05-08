import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  profileId: number;

  @Column()
  profileCode: string;

  @Column()
  profileName: string;

  @OneToMany(() => User, (user) => user.userprofileId)
  users: User[];
}
