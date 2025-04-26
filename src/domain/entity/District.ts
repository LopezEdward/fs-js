import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Seller } from "./Seller";

@Entity({name: "distrito"})
export class District {
    @PrimaryGeneratedColumn("identity",{name:"dis_id", type:"bigint"})
    id!: number;

    @Column("varchar", {length: 40, nullable: false, unique: true, name: "dis_name"})
    name!: string;

    @OneToMany(() => Seller, (seller) => seller.district, {lazy: true})
    sellers!: Relation<Seller[]>;
}