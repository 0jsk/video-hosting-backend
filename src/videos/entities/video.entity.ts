import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
