/* tslint:disable */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("contacts")
export class Contacts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @Column({
    name: "name",
    length: 30,
    type: "varchar",
    nullable: false,
  })
  name: string;

  @Index({ unique: true })
  @Column({
    name: "email",
    length: 50,
    type: "varchar",
    nullable: true,
  })
  email?: string;

  @Column({
    name: "phone",
    length: 15,
    type: "varchar",
    nullable: true,
  })
  phone?: string;
}
