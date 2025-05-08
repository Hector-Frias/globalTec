import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  userEmail: string;

  @Column()
  userAge: number;

  @Column()
  userprofileId: number;

  @ManyToOne(() => Profile, (profile) => profile.users)
  @JoinColumn({ name: 'userprofileId' }) // 👈 Asegura que TypeORM use la columna correcta
  userProfile: Profile;
}
