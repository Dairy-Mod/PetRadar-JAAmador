import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Point } from 'typeorm';

@Entity('lost_pets')
export class LostPet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  species!: string;

  @Column()
  breed!: string;

  @Column()
  color!: string;

  @Column()
  size!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'photo_url', type: 'varchar', nullable: true })
  photoUrl!: string | null;

  @Column({ name: 'owner_name' })
  ownerName!: string;

  @Column({ name: 'owner_email' })
  ownerEmail!: string;

  @Column({ name: 'owner_phone' })
  ownerPhone!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: Point;

  @Column()
  address!: string;

  @Column({ name: 'lost_date', type: 'timestamp' })
  lostDate!: Date;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
