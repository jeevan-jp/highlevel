/* tslint:disable */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
    name: "first_name",
    length: 250,
    type: "varchar",
    nullable: false,
  })
  firstName: string;

  @Column({
    name: "email",
    length: 250,
    type: "varchar",
    nullable: true,
  })
  email?: string;

  @Column({
    name: "phone",
    length: 50,
    type: "varchar",
    nullable: true,
  })
  phone?: string;
}
